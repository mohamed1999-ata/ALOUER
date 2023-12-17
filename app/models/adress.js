const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const AdressSchema = new Schema({

	longitude : {
		type : Number
	},
	latitude : {
       type: Number
	}
})


module.exports = mongoose.model('adress' , AdressSchema)