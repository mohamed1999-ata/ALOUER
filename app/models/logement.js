const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const LogementSchema = new Schema({
    type : {
        type : String
    },
    nombre_de_chambre :{
        type : Number
    },
    type_chambre:{
        type:String 
    },
    salle_de_bain :{
        type : Number
    },
    nombre_de_lits :{
        type : Number
    },
    capacite :{
        type : Number
    },
    
    equipement : 
        {
          type: mongoose.Schema.Types.ObjectId,ref: "equipement"
        }
     ,
     gouvernorat :{
        type:String
     },
    
    ville :{
        type : String
    },
    adress :{
        type : String
    },
    codePostal :{
        type : String
    },

})


module.exports = mongoose.model('Logement' , LogementSchema)