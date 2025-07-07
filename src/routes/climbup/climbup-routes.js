const { Router } = require("express");
const ClimbUpController = require("../../controller/climbup_controllers/ClimbUpController");

const climbUpController = new ClimbUpController();

const route = Router();

route.post("/api/webhook/consulta-servico", (req, res) => {
  climbUpController.consultarServico(req, res);
});

module.exports = route;
