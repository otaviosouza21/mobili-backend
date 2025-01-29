const { Router } = require("express");

const UserController = require("../../controller/empresa_controllers/UserController");

const userController = new UserController();

const route = Router();


route.get("/api/empresa-usuarios", (req, res) => {userController.pegasTodosController(req,res)});