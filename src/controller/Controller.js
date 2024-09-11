const { response } = require("express");

class Controller{
    constructor(propsServices){
        this.propsServices = propsServices;
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
          .json({ mensagem: 'Registro Criado', novoRegistroCriado });
      } catch (error) {
        return res.status(400).json({mensagem:'Registro não criado', erro: error})
      }
    }

    //===Pega todos os registros

    async pegasTodosController(req,res){
        try{
            const listaDeRegistro = await this.propsServices.pegaTodosRegistros();
            
            return res.status(200).json(listaDeRegistro)
        }
        catch(e){
            console.log(e)
            return res.status(500).json({message: `erro ao buscar registro, mensagem de erro: ${e}`})
        }
    }

    //===Atualiza Registro pela ID

    async atulizaDadoController(req, res) {
        const { id } = req.params;
        const dadosAtualizados = req.body;
        try {
          const umRegistro = await this.propsServices.pegaUmRegistroPorId(Number(id));
          if(umRegistro == null){
            return res.status(400).json({message:`não foi possivel encontrar o registro: ${id}`,resposta:umRegistro});
          }
          const bodyOk = Object.getOwnPropertyNames(dadosAtualizados).every((campo) => {
            return Object.values(umRegistro._options.attributes).includes(campo);
          });
    
          if(bodyOk){
            const foiAtulizado = await this.propsServices.atualizaDado(dadosAtualizados,Number(id)); 
            return res.status(200).json({ message: `registro atualizado`, reg:umRegistro});
          }else{
            return res.status(400).json({ message: `campos digitados não conferem`});
          }
    
        } catch (e) {
          return res.status(500).json(e.message);
        }
      }

     //===Exclui Registro pela ID

}

module.exports = Controller;

