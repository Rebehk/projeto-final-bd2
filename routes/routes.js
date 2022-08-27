const routes = require("express").Router();
const devicesController = require("../controller/dispositivoController");
const neo4jdbEntityContr = require("../controller/neo4jdbEntity");

routes.get("/inicio", devicesController.listarDispositivos);
routes.post("/add", devicesController.adicionarDispositivo);
routes.get("/busca/:modelo",devicesController.buscarDispositivo);
routes.delete("/deleta/:modelo", devicesController.deletarDispositivo);
routes.put("/atualiza", devicesController.atualizarDispositivo);
routes.get("/ultimos", devicesController.ultimosDispositivos);
routes.post("/adicionar_pessoa", neo4jdbEntityContr.addPessoa);
routes.post("/favoritar_dispositivo", neo4jdbEntityContr.favoritarDispositivo);
routes.get("/busca_usuario/:id", neo4jdbEntityContr.getUsuario);
routes.get("/listar_dispositivos_favoritados_por/:pessoa", neo4jdbEntityContr.buscarFavoritadosPorUmUsuario);

module.exports = routes;
