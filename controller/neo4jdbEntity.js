const neo4j = require("../database/neodb");
const { request, response } = require("express");

const addPessoa = async (request, response) => {
    try {
        const session = neo4j.session();

        await session.run(`CREATE (:Pessoa{email:"${request.body.email}", 
                nome:"${request.body.nome}" })`);
        await session.close();

      response.status(200).send("Salvo com sucesso");
    } catch (err) {
      response.status(500).send({ error: err.message });
    }
}

const favoritarDispositivo = async (request, response) => {
  const session = neo4j.session();
  const result =
    await session.run(`match(p1:Pessoa{email:"${request.body.email}"})
      optional match(d1:Dispositivo{modelo:"${request.body.modelo}"})
      create (p1)-[:LIKE]->(d1)`);
  if (result.summary.counters._stats.relationshipsCreated > 0) {
    response.status(200).send("Favorito adicionado.");
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

const getUsuario =  async function(request, response) {
    const {id} = request.params.email;
    const query = `match(p1:Pessoa{email:"${request.params.email}"}) return p1`
    const resultObj = await neo4j.executeCypherQuery(query, id);
    const result = formatResponse(resultObj);
    response.status(200).send(result);
};

const buscarFavoritadosPorUmUsuario =  async (request, response) => {
    const { id } = request.params.email;
    const query = "MATCH (n:Pessoa {email: $id})-[:LIKE]-(d:Dispositivo) RETURN d";
    const params = { id: parseInt(id) };
    const resultObj = await neo4j.executeCypherQuery(query, params);
    const result = formatResponse(resultObj);
    response.status(200).send(result);
};

module.exports = { 
    addPessoa,
    getUsuario,
    favoritarDispositivo,
    buscarFavoritadosPorUmUsuario
}