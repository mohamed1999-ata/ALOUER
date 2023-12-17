const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const DisponibilteSchema = new Schema({

	start : {
		type : Date
	},
	price : {
       type: Number
	},
	etat : {
		type : Boolean ,
		default : true
	},
	annonce : 
		{
		  type: mongoose.Schema.Types.ObjectId,ref: "annonce"
		}
	 
},
{ timestamps: true }
)


module.exports = mongoose.model('disponibilte' , DisponibilteSchema)