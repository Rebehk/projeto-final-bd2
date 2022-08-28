require("dotenv").config();

const neo4j = require("neo4j-driver");

const gdbdriver = neo4j.driver(
  `bolt://${process.env.NEO4J_HOST}`,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);


async function executeCypherQuery(statement, params = {}) {
  const session = gdbdriver.session();
  try {
    const result = session.run(statement, params);
    session.close();
    return result;
  } catch (error) {
    throw new Error('FATAL ERROR: ao executar CypherQuery.');
  }
}

module.exports = {
  gdbdriver,
  executeCypherQuery
}
