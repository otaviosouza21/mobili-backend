const Controller = require("../../Controller.js");
const { createInflateRaw } = require("zlib");
const { sequelize } = require("../../../models/index.js");
const bcrypt = require('bcrypt');
const Usuario_Services = require("../../services/empresa_services/usuarios/UsuarioServices.js");

const usuarioServices = new Usuario_Services();

class UserController extends Controller {
  constructor() {
    super(usuarioServices);
  }

  

  async registerUserController(req, res) {
   const { email, permissoes, empresa_id } = req.body;
    const bodyReq = req.body;

    try {
      const isTrue = await this.allowNull(req, res);
      if (!isTrue.status) {
        return res.status(500).json({
          message: "Preencha todos os campos necessários",
          campos: isTrue.campos,
          error: true,
        });
      }

      // Verifica se o usuário já existe
      const userExist = await usuarioServices.pegaUsuarioPorEmail_Services(
        email
      );
      if (userExist.status) {
        return res.status(422).json({
          message: "O e-mail informado já está em uso!",
          error: true,
        });
      }

      // Verifica se "permissoes" foi informado corretamente
      if (!permissoes || !Array.isArray(permissoes)) {
        return res.status(400).json({
          message: "Permissões não fornecidas ou inválidas",
          error: true,
        });
      }

      // Valida cada permissão e adiciona as subtelas, se houver
      let permissoesComSubtelas = [];
      for (const perm of permissoes) {
        const tela = await devAgile.Permissao.findByPk(perm.permissao_id, {
          include: [{ model: devAgile.Permissao, as: "subpermissoes" }],
        });

        if (!tela) {
          return res.status(400).json({
            message: `A permissão ${perm.permissao_id} não existe`,
            error: true,
          });
        }

        // Adiciona a permissão principal
        permissoesComSubtelas.push(perm);

        // Se houver subtelas associadas à tela, adiciona-as com os mesmos acessos
        if (tela.subpermissoes.length > 0) {
          tela.subpermissoes.forEach((subtela) => {
            permissoesComSubtelas.push({
              permissao_id: subtela.id,
              acessos: perm.acessos,
              acoes: [], // Aqui você pode definir ações específicas para a subtela, se necessário
            });
          });
        }
      }

      // Valida se a empresa foi informada
      if (!empresa_id) {
        return res
          .status(400)
          .json({ message: "ID da empresa não fornecido", error: true });
      }
      const empresa = await usuario_services.pegaUsuarioPorId_Services(
        empresa_id
      );
      if (!empresa) {
        return res
          .status(404)
          .json({ message: "Empresa não encontrada", error: true });
      }

      //Pega a empresa pelo id e recupera a tagName
      const { tag } = await empresa_services.pegaEmpresaPorId_Services(
        empresa_id
      );

      // Função para gerar uma senha aleatória de 8 caracteres alfabeticos
      const createRandomPassword = () => {
        const caracteres =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let senha = "";
        for (let i = 0; i < 6; i++) {
          const randomIndex = Math.floor(Math.random() * caracteres.length);
          senha += caracteres[randomIndex];
        }
        return senha;
      };

      // Gera a senha aleatória
      const senhaGerada = createRandomPassword();

      //Pega template de email e substitui as variaveis
      const templatePath = path.join(
        __dirname,
        "..",
        "..",
        "utils",
        "templates",
        "email",
        "new-user-password.html"
      );
      const htmlTemplate = fs.readFileSync(templatePath, "utf8");
      const htmlContent = htmlTemplate
        .replace("{{NOME_USUARIO}}", bodyReq.nome)
        .replace("{{SENHA_TEMPORARIA}}", senhaGerada)
        .replace("{{TAG_EMPRESA}}", tag);

      // envia o email com a senha criptografadas
      const mail = await sendEmailRaw({
        from: [process.env.EMAIL_PRINCIPAL],
        to: email,
        subject: "Cadastro de Usuário",
        html: htmlContent,
      });
      console.log(mail);

      // Gera a senha criptografada
      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(senhaGerada, salt);
      bodyReq.senha = senhaHash;

      // Chama o serviço para registrar o usuário com o novo formato de permissões
      const createUser = await usuario_services.cadastraUsuario_Services(
        bodyReq,
        permissoesComSubtelas
      );

      if (createUser.status) {
        return res.status(200).json({
          message: `Usuário cadastrado e vinculado à empresa com sucesso`,
          error: false,
        });
      } else {
        return res.status(500).json({
          message: createUser.message || "Erro ao cadastrar o usuário",
          error: true,
        });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Erro ao buscar registro, contate o administrador do sistema",
        error: true,
      });
    }
  }
}

module.exports = UserController;
