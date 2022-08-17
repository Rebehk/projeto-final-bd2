const mongoose = require("../database/db");
const dispositivoSchema = new mongoose.Schema({
    fotoLink: {type:String, required: true},
    fabricante: { type: String, required: true},
    modelo: { type: String, required: true, unique : true},
    preco: { type: String, required: true },
    processador: {type: String, required: true},
    memoriaInterna: {type: String, required: true},
    memoriaRam: {type: String, required: true}
});
const Dispositivo = mongoose.model("dispositivo", dispositivoSchema);
module.exports = Dispositivo;