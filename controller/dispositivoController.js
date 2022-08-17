const Dispositivo = require("../model/dispositivo");

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
    const encontrado = await Dispositivo.findOne(
      { modelo: request.params.modelo },
      { __v: false }
    );
    if (encontrado) {
      response.status(200).send(encontrado);
    } else {
      response.status(400).send("Dispositivo não encontrado!");
    }
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
};

const adicionarDispositivo = async (request, response) => {
  const dispositivo = new Dispositivo(request.body);
  console.log(request.body);
  dispositivo
    .save()
    .then(() => {
      response.status(200).send("Salvo com sucesso!");
    })
    .catch((err) => {
      response.status(400).send("Erro ao salvar!");
    });
};

const deletarDispositivo = async (request, response) => {
  const result = await Dispositivo.deleteOne({ modelo: request.params.modelo });
  if (result.deletedCount > 0) {
    response.status(200).send("Removido com sucesso!");
  } else {
    response.status(400).send("Operação não sucedida!");
  }
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
};
