const neo4j = require("../database/neodb");
const { request, response } = require("express");

const addPessoa = async (request, response) => {
  try {
    const session = neo4j.gdbdriver.session();

    await session.run(`CREATE (:Pessoa{email:"${request.body.email}", 
                nome:"${request.body.nome}" })`);
    await session.close();
    console.log(request.body);
    response.status(200).send("Salvo com sucesso");
  } catch (err) {
    response.status(500).send({ error: err.message });
  }
}

const favoritarDispositivo = async (request, response) => {
  const session = neo4j.gdbdriver.session();
  const result =
    await session.run(`match(p1:Pessoa{email:"${request.body.email}"})
      optional match(d1:Dispositivo{modelo:"${request.body.modelo}"})
      create (p1)-[:LIKE]->(d1)`);
  if (result.summary.counters._stats.relationshipsCreated > 0) {
    response.status(200).send("Favorito adicionado.");
    console.log(request.body);
  } else {
    response.status(400).send("Falha ao favoritar.");
  }
  await session.close();
};

function formatResponse(resultObj) {
  const result = [];
  if (resultObj.records.length > 0) {
    resultObj.records.map((record) => {
      result.push(record._fields[0].properties);
    });
  }
  return result;
}

//PARA SABER SE UM USUARIO ESTA NO NEO4J
const getUsuario = async function (request, response) {
  const session = neo4j.gdbdriver.session();
  const query = `match(p1:Pessoa{nome:"${request.params.nome}"}) return p1`
  const resultObj = await session.run(query);
  const result = formatResponse(resultObj);
  console.log(result)
  await session.close();
  response.status(200).send(result);
};

const buscarFavoritadosPorUmUsuario = async (request, response) => {
  const session = neo4j.gdbdriver.session();
  const query = `MATCH (n:Pessoa {email: "${request.params.email}"})-[:LIKE]-(d:Dispositivo) RETURN d`;
  const resultObj = await session.run(query);
  const result = formatResponse(resultObj);
  console.log(result)
  await session.close();
  response.status(200).send(result);
};

module.exports = {
  addPessoa,
  getUsuario,
  favoritarDispositivo,
  buscarFavoritadosPorUmUsuario
}