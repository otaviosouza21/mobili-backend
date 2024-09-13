const model = require("../models");

class Services {
  constructor(nomeModel) {
    this.nomeModel = nomeModel;
  }
  
 /*CREATE*/
  async criaRegistro(dadosDoRegistro) {
    return model[this.nomeModel].create(dadosDoRegistro);
}

  async criaVariosRegistros(registros,dadosParaAtualizar){
   
    
      return model[this.nomeModel].bulkCreate(registros,{
        updateOnDuplicate: dadosParaAtualizar
      })
  }

  /*READ*/
  async pegaTodosRegistros() {
    console.log(model[this.nomeModel]);

    return model[this.nomeModel].findAll();
  }

  /*READ ONLY TO ID*/
  async pegaUmRegistroPorId(id) {
    return model[this.nomeModel].findByPk(id);
  }

  /*UPDATE TO ID*/
  async atualizaDado(dadosAtualizados, id) {
    const ListaDeRegistrosAtualizado = await model[this.nomeModel].update(
      dadosAtualizados,
      { where: { id: id } }
    );
    if (ListaDeRegistrosAtualizado === 0) {
      return false;
    } else {
      return true;
    }
  }

  /*DELETE TO ID*/ 
  async excluiRegistro(id) {
        return model[this.nomeModel].destroy({ where: { id: id } });
    }
}

module.exports = Services;
