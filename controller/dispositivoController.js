const Dispositivo = require("../model/dispositivo");
const dataCache = require("../database/redisdb");
const { request, response } = require("express");
const neo4j = require("../database/neodb");

const listarDispositivos = async (request, response) => {
  try {
    const dispositivosList = await Dispositivo.find({}, { _id: false });
    return response.status(200).send(dispositivosList);
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
};

const buscarDispositivo = async (request, response) => {
  try {
    const modelo = request.params.modelo;
    const client = await dataCache.conectar();
    let encontrado = await client.get(modelo);
    if (encontrado == null) {
        encontrado = await Dispositivo.findOne(
        { modelo: modelo },
        { __v: false }
      );
      if (encontrado) {
        console.log("Dispositivo trazido do MongoDB, atualizando cache...");
        const result = await client.set(encontrado.modelo, JSON.stringify(encontrado), {
          EX: 3600,
        });
        await client.disconnect();
        response.status(200).send(encontrado);
      } else {
        await client.disconnect();
        response.status(400).send("Dispositivo não encontrado!");
      }
    } else {
      //Se objeto estiver no cache
      console.log("Dispositivo trazido do cache");
      encontrado = JSON.parse(encontrado);
      await client.disconnect();
      response.status(200).send(encontrado);
    }
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
};

const ultimosDispositivos = async (request, response) => { 
    const client = await dataCache.conectar();
    let listaCache = await client.keys("*");
    if(listaCache){
        await client.disconnect();
        response.status(200).send(listaCache);
    }else{
        response.status(400).send("Lista sem dispositivos.");
    }
}

const adicionarDispositivo = async (request, response) => {
  const dispositivo = new Dispositivo(request.body);
  console.log(request.body);
  dispositivo
    .save()
    .then(async () => {
      const session = neo4j.gdbdriver.session();
      await session.run(`CREATE (:Dispositivo{modelo:"${request.body.modelo}"})`);
      await session.close();
      response.status(200).send("Salvo com sucesso!");
    })
    .catch((err) => {
      response.status(400).send("Erro ao salvar!");
    });
};

const deletarDispositivo = async (request, response) => {
  const result = await Dispositivo.deleteOne({ modelo: request.params.modelo }).
  then(async () => {
    const session = neo4j.gdbdriver.session();
    await session.run(`MATCH (d:Dispositivo{modelo:"${request.params.modelo}"}) DELETE d`);
    await session.close();
    response.status(200).send("Removido com sucesso!");
  });
  
};

const atualizarDispositivo = async (request, response) => {
  const result = await Dispositivo.updateOne(
    { modelo: request.body.modelo },
    {
      $set: {
        fotoLink: request.body.fotoLink,
        fabricante: request.body.fabricante,
        modelo: request.body.modelo,
        preco: request.body.preco,
        processador: request.body.processador,
        memoriaInterna: request.body.memoriaInterna,
        memoriaRam: request.body.memoriaRam,
      },
    }
  );

  if (result.modifiedCount > 0) {
    response.status(200).send("Dispositivo atualizado!");
  } else {
    response.status(400).send("Operação não sucedida!");
  }
};

module.exports = {
  listarDispositivos,
  buscarDispositivo,
  adicionarDispositivo,
  atualizarDispositivo,
  deletarDispositivo,
  ultimosDispositivos
};
