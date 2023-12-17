const passport = require("passport");
const userModel = require("../../models/user");
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID) ;
const mongoose = require('mongoose');

exports.signInWithGoogle =  async (req , res)=>{
    const idToken = req.body.idToken;
   
    const expiresIn = "1d" ;
    try{
        const ticket = await  client.verifyIdToken({
            idToken ,
            audience :process.env.GOOGLE_CLIENT_ID
        }) ;

        const payload = ticket.getPayload();
    
        if(payload && payload?.email_verified){
            const user = {
                email : payload?.email ,
                firstName : payload?.given_name,
                lastName : payload?.family_name,
                provide :  "google" ,
                password : "12345678" ,
                ProfilImage : payload?.picture 

            }
     

            const existUser = await userModel.findOneAndUpdate({
                email : user.email
            } ,
            {$set : {provide :"google"} } ,
            {new : true , omitUndefined : true}
            ) ;
           if(existUser) {
            const payloadObj = {
                _id: existUser._id,
                email: existUser.email,
            };
    
            const token = jwt.sign(
                {
                    user: payloadObj,
                },
                process.env.PASSPORT_SECRET,
                { expiresIn: expiresIn }
            );
    
            user.password = null;
            // Send back the token to the user
            return res.json({
                token,
                expiresIn,
                user :existUser ,
            });
               
              }
           else{
             
            const createdUser = await userModel.create({
               _id : new mongoose.Types.ObjectId(), 
               email : user.email ,
               password : user.password ,
               lasName : user.lastName ,
               firstName : user.firstName,
               ProfilImage : user.ProfilImage
            });
            const payloadObj = {
                _id: createdUser._id,
                email: createdUser.email,
            };
    
            const token = jwt.sign(
                {
                    user: payloadObj,
                },
                process.env.PASSPORT_SECRET,
                { expiresIn: expiresIn }
            );
    
            createdUser.password = null;
    
            // Send the user information to the next middleware
            return res.json({
                token,
                expiresIn,
                user :  createdUser,
            });
           } 
           
           
        }

        
    }catch(error){
      console.log(error);
    }

}