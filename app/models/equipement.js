
const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const EquipementSchema = new Schema({
 
 equipement_de_base :[
   {
    type : String
   }
 ] ,

Commodite_additionnelle :[
   {
    type : String
   }
 ] ,
 


})


module.exports = mongoose.model('equipement' , EquipementSchema)