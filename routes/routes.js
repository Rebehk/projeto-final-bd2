const routes = require("express").Router();
const devicesController = require("../controller/dispositivoController");

routes.get("/inicio", devicesController.listarDispositivos);
routes.post("/add", devicesController.adicionarDispositivo);
routes.get("/busca/:modelo",devicesController.buscarDispositivo);
routes.delete("/deleta/:modelo", devicesController.deletarDispositivo);
routes.put("/atualiza", devicesController.atualizarDispositivo);

module.exports = routes;
