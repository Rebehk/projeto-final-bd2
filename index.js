const express = require("express");
const cors = require("cors")
const routes = require("./routes/routes");
//para importar css
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors())
app.use(routes);
//app.use(express.static(path.join(__dirname, "public")));

app.listen(process.env.API_PORT, () => {
  console.log(`API rodando na porta ${process.env.API_PORT}`);
});
