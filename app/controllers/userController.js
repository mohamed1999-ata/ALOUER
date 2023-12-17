const express = require("express");
const passport = require("passport");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const multer = require('multer')
const app = express();
const storage = multer.diskStorage({
	destination :  "./public/user",
	filename : function(req , file , cb){
		cb(null,    Date.now() + file.originalname);
	}
     })

	 const upload = multer({
		 storage : storage
	 }).single("myImage");



//****  edit User */



exports.editUser = async(req , res)=>{
	const id = req.params.id ;
    try {
     const data = {
		lastName : req.body.lastName,
		firstName :req.body.firstName ,
		email : req.body.email ,
		numeroTelephone : req.body.numeroTelephone,
		ville : req.body.ville ,
		adresse : req.body.adresse ,
	 };

	 const userUpdate = await user.findOneAndUpdate(
	 	  { _id : id},
	 	  data , 
          {new : true , omitUndefined : true})
	
   if (userUpdate){
   	return res.status(201).send(userUpdate)
   }
   else{
   	return res.status(500).send({message :  "erron cannont update user! "})
   }
    } catch(err){
       return res.status(500).send({message : err})

    }
    


}



//**Get User By ID */


  exports.userBYid= async (req , res)=>{
 const id = req.params.id 
     await user.findById({_id : id})
     .then(result=>{
     	if(result){
     		res.status(200).send(result)
     	}else{
     		res.status(500).json({message : "error ! user not found"})
     	}
     }).catch(error=>{
     	res.status(500).send(error.message)
     })	
  }

  //profil 
    exports.profil= async (req , res)=>{
 const id = req.params.id 
     await user.findById({_id : id})
     .then(result=>{
     	if(result){
     		res.status(200).send(result)
     	}else{
     		res.status(500).json({message : "error ! user not found"})
     	}
     }).catch(error=>{
     	res.status(500).send(error.message)
     })	
  }

   //**upload prifile Image  */



  exports.uploadImage=   (req, res) => {
	 
	upload (req, res,  (err) => {
        if (err) {
		res.status(500).json({message :  err})
		 }
	   else {
		if (req.file == undefined) {
		     res.status(500).json({message : "file undefined"})
		} else {
	     user.findByIdAndUpdate(
			    req.params.id,
			{ ProfilImage: req.file.filename },
             { new: true, omitUndefined: true }
	     )
	     .then(user=>{
	     	if (user) {
	     	   return res.status(201).json(user);
	     	}
	     }).catch(err=>{
	     	 return res.status(500).send(err)
	     })

	    }

	    }
	 
	});
  };


  exports.getAllUsers = async(req , res)=>{
    try{
    const users=  await user.find({})
     return res.status(200).send(users)

    }catch(err){
      return res.status(500).send(err)
    }
  }



// get Number of users 

exports.countUsers = async(req,res)=>{
    try{
         const count = await user.countDocuments({});
         res.status(201).json({count})
 
    }catch(err){
      res.status(500).json({err})
    }

}