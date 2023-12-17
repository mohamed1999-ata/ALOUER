const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const AnnonceSchema = new Schema({
     propritaire: {
        type: mongoose.Schema.Types.ObjectId,ref: "user"
      },
     logement: {
        type: mongoose.Schema.Types.ObjectId,ref: "Logement"
      },
      titre:{
          type : String
      },
      descreption:{
        type : String
      },
      annonceImage :[{
        type : String
      }],
      etat :{
        type : Boolean
      },
      prix :{
        type : Number
      },
      verif :{
        type :  Boolean,
        default : false
      },
      coordinate : {
          type : mongoose.Schema.Types.ObjectId , ref :"adress"

      },
      disponibilte :[
       {
        type: mongoose.Schema.Types.ObjectId,ref: "disponibilte"
       }
      ],
      vues :[
        {
         type : mongoose.Schema.Types.ObjectId , ref :"user"
        }
      ],
      
},
 { timestamps: true })

module.exports = mongoose.model('annonce' , AnnonceSchema)