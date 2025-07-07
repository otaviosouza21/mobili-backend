const { log } = require("console");
const { response } = require("express");
const sendEmail = require("../middleware/sendEmail");

class Controller {
  constructor(propsServices, campos) {
    this.propsServices = propsServices;
    this.camposObrigatorios = campos;
  }

  //cria novo
  async criaNovo(req, res) {
    const dadosParaCriacao = req.body;

    try {
      const novoRegistroCriado = await this.propsServices.criaRegistro(
        dadosParaCriacao
      );
      return res
        .status(200)
        .json({ mensagem: "Registro Criado", novoRegistroCriado });
    } catch (error) {
      return res
        .status(400)
        .json({ mensagem: "Registro não criado", erro: error });
    }
  }

  //cria registros em massa, caso ja tenha, atualiza
  async criaVarios(req, res) {
    const registrosParaCriacao = req.body;

    if (registrosParaCriacao.length === 0)
      throw new Error("Não há dados para criação");

    try {
      const keys = Object.keys(registrosParaCriacao[0]);

      const novosRegistrosCriados =
        await this.propsServices.criaVariosRegistros(
          registrosParaCriacao,
          keys
        );
      return res
        .status(200)
        .json({ mensagem: "Registros Criados", novosRegistrosCriados });
    } catch (error) {
      return res
        .status(400)
        .json({ mensagem: "Falha ao criar registro", error });
    }
  }

  //===Pega todos os registros

  async pegasTodosController(req, res) {
    try {
      const listaDeRegistro = await this.propsServices.pegaTodosRegistros();
      return res.status(200).json(listaDeRegistro);
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: `erro ao buscar registro, mensagem de erro: ${e}` });
    }
  }

  //===Atualiza Registro pela ID

  async atulizaDadoController(req, res) {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    try {
      const umRegistro = await this.propsServices.pegaUmRegistroPorId(
        Number(id)
      );
      if (umRegistro == null) {
        return res.status(400).json({
          message: `não foi possivel encontrar o registro: ${id}`,
          resposta: umRegistro,
        });
      }
      const bodyOk = Object.getOwnPropertyNames(dadosAtualizados).every(
        (campo) => {
          return Object.values(umRegistro._options.attributes).includes(campo);
        }
      );

      if (bodyOk) {
        const foiAtulizado = await this.propsServices.atualizaDado(
          dadosAtualizados,
          Number(id)
        );
        return res
          .status(200)
          .json({ message: `registro atualizado`, reg: umRegistro });
      } else {
        return res
          .status(400)
          .json({ message: `campos digitados não conferem` });
      }
    } catch (e) {
      return res.status(500).json(e.message);
    }
  }

  
  async allowNull(req, res) {
    this.camposVazios = []; // serve para nao acumular valores duplicados na array

    this.camposObrigatorios.forEach((campo) => {
      if (req.body[campo] == null || req.body[campo] === "") {
        this.camposVazios.push(campo);
      }
    });

    if (this.camposVazios.length === 0) {
      return { status: true };
    } else {
      return { status: false, campos: this.camposVazios };
    }
  }
}

module.exports = Controller;
