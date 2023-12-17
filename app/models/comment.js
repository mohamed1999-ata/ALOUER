
const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;


const  commentSchema = new mongoose.Schema({
   
    comment:{
        type:String,
        required:"this filed is required"
    },
    annonce:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Annonce'
    },
    user :{
       type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }

},{
    timestamps: true
    
})

module.exports = mongoose.model('comment' , commentSchema)