const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const ResevationSchema = new Schema({
     locataire: {
        type: mongoose.Schema.Types.ObjectId,ref: "user"
      },
     annonce: {
        type: mongoose.Schema.Types.ObjectId,ref: "annonce"
      },
      depart:{
          type : Date
      },
      arrive:{
        type : Date
      },
      prix_final :{
        type : Number
      },
      etat :{
        type : Boolean ,
        default : false
      }
},
 { timestamps: true })

module.exports = mongoose.model('reservation' , ResevationSchema)