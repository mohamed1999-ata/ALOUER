const AnnonceModel = require("../models/annonce");
const LogementModel = require("../models/logement");
const EquipementModel = require("../models/equipement");
const UserModel = require("../models/user");

const multer = require("multer");
const Moment = require('moment');
const nodemailer = require('nodemailer');



exports.userAnnonceNonPublier = async (req, res) => {
  const id = req.params.id;
  try {
    const annonce = await AnnonceModel.find({ propritaire: id, verif: false })
      .populate({ path: "logement", populate: { path: "equipement" } })
      .populate("propritaire");

    return res.status(201).send(annonce);
  } catch (err) {
    return res.status(500).send(err);
  }
};

/// methode accepter anonnce by admin

exports.acceptAnnonce = async (req, res) => {
  const {emailPropriétaire,IdAnnonce} = req.body
  try {
    const annonce = await AnnonceModel.findByIdAndUpdate(
      IdAnnonce,
      { verif: true },
      { new: true, omitUndefined: true }
    );

    
 console.log(await sendEmailToPropriétaire(emailPropriétaire)) 

       return res.status(201).send(email);

    
  } catch (err) {
    return res.status(201).send(err);
  }
};

/// send email to propriétaire  

 var sendEmailToPropriétaire = async(email)=>{

  console.log( email)
  const transporter = nodemailer.createTransport({
          host : process.env.PORT ,
          service : process.env.SERVICE,
          port : 587 ,
          secure : true ,
          auth : {
              user : process.env.EMAIL_ADRESS ,
              pass : process.env.PASSWORD
          }
      }) ;
      const mailOptions = {
        from: `${process.env.EMAIL_ADRESS}`,
        to:`${email}`,
        subject: "[Pfe projet]",
        html:  "votre annonce est accepter "   
      }
      await transporter.sendMail(
          mailOptions ,
          (error)=>{
              if(error) {
                console.log(error)
                  res.status(400).send(error)
              }
              else{
                res.send({message : "email send successfully"}) ;         
            }
          }
      ) 


      
  
    
   
        
       
 }



exports.annonceNonAccepter = async (req, res) => {
  try {
    const annonces = await AnnonceModel.find({ verif: false })
      .populate({ path: "logement", populate: { path: "equipement" } })
      .populate("propritaire")
      .sort({ createdAt: "descending" });
    return res.status(200).json(annonces);
  } catch (err) {
    console.log(err);
  }
};


exports.NumberOfAnnonceNonAccepter =  async(req ,res)=>{
    try {
    const count = await AnnonceModel.countDocuments({verif: false });

    return res.status(200).json(count);
  } catch (err) {
    console.log(err);
  }
}



/// logement group by ville 



exports.logementGroupByVille = async (req,res)=>{
  try{
    const aggregatorOpts = [  
    {
      $lookup: {
        from: "annonces",
        localField: "annonce",
        foreignField: "_id",
        as: "annonce",
      },
    },
     { "$group": {
        "_id": {
            "gouvernorat": "$gouvernorat",
             "annonce"   : "annonce._id"
        },
        "villeCount": { "$sum": 1 }

    }},]
   const result  =  await LogementModel.aggregate(aggregatorOpts).sort({villeCount : -1}).exec()

   res.status(201).send(result)

   
  }catch(error){

    res.status(500).send(error)
  }
}


//nombre des annonces par mois 

exports.annoncesGroupByMois = async (req,res)=>{
  try{
    const aggregatorOpts = [  
   
     { "$group": {
        "_id": {
            "date":  { "$month": "$createdAt" } ,
           
        },
        "nbrAnnonce": { "$sum": 1 }

    }},]
   const result  =  await AnnonceModel.aggregate(aggregatorOpts).sort({nbrAnnonce:1}).exec()

   res.status(201).send(result)

  }catch(err){
 res.status(500).send(err)

  }
}