const AnnonceModel = require("../models/annonce");
const LogementModel = require("../models/logement");
const EquipementModel = require("../models/equipement");
const UserModel = require("../models/user");
const multer = require("multer");
const Moment = require('moment');
const nodemailer = require('nodemailer');



MomentRange = require("moment-range"), 
moment = MomentRange.extendMoment(Moment); 

const storage = multer.diskStorage({
  destination: "./public/annonce",
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // allow images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image are allowed."), false);
    }
    cb(null, true);
  },
}).any("annonceImage");

// ajouter annonce
exports.newAnonnce = async (req, res) => {
  const equipement = new EquipementModel({
    equipement_de_base: req.body.equipement_de_base,
    Commodite_additionnelle: req.body.Commodite_additionnelle,
  });

  equipement.save();

  const logement = new LogementModel({
    equipement: equipement,
    type: req.body.type_logement,
    type_chambre : req.body.type_chambre ,
    nombre_de_chambre: req.body.nombre_de_chambre,
    salle_de_bain: req.body.salle_de_bain,
    nombre_de_lits: req.body.nombre_de_lits,
    capacite: req.body.capacite, 
    ville: req.body.ville,
    adress: req.body.adress,
    codePostal: req.body.CodePostal,
    gouvernorat : req.body.gouvernorat
  });

  logement.save();

  id_propritaire = req.params.id;
  const annonce = new AnnonceModel({
    propritaire: id_propritaire,
    logement: logement,
    titre: req.body.titre_annonce,
    descreption: req.body.description,
    etat: req.body.etat,
    prix: req.body.prix,
  });
  annonce
    .save()
    .then((annonce) => {
      if (annonce) {
        res.status(200).json({
          message: "annonce added successfully",
          id: annonce.id,
        });
      } else {
        res.status(500).send({ message: "error !" });
      }
    })
    .catch((e) => {
      console.log(e);
    });
};


/// modifier annonce 
// modifier annonce
exports.updateAnnonce = async (req, res) => {
  try {
    const annonceId = req.params.id ;
    console.log(annonceId)
    const { type_logement , type_chambre , nombre_de_lits , nombre_de_chambre  ,
     titre_annonce , description  , ville , adress , gouvernorat , codePostal,
     capacite  , salle_de_bain  ,titre , equipement_de_base , Commodite_additionnelle ,
    start , end , price } = req.body
    const annonceUpdatedt = await AnnonceModel.findById({_id : annonceId})

   const logementUpdated =  await  LogementModel.findById({
     _id : annonceUpdatedt.logement
   })


   const  equipementUpdatedt =  await  EquipementModel.findOneAndUpdate({
    _id :  logementUpdated.equipement
   },
      { 

        equipement_de_base: equipement_de_base ,
        Commodite_additionnelle : Commodite_additionnelle
      },
      { new: true, omitUndefined: true })

     const  dataLogement = {
       nombre_de_lits : nombre_de_lits ,
       nombre_de_chambre : nombre_de_chambre ,
       ville : ville ,
       capacite : capacite ,
       type :  type_logement ,
       salle_de_bain  : salle_de_bain ,
       type_chambre :  type_chambre 

     }


     const updateLogemet = await LogementModel.findOneAndUpdate({
      _id : logementUpdated._id
     },
     dataLogement
     ,
      { new: true, omitUndefined: true })

     


    const annonce = {
      titre: titre_annonce,
      descreption: description,
      prix: price,
    };
    await AnnonceModel.findByIdAndUpdate(
      { _id: req.params.id },
      annonce,
      function (err, result) {
        if (err) {
          console.log(err)
          res.send(err);
        } else {
          res.send(result._id);
        }
      }
    );
  } catch (error) {
    console.log(error)
  }
}; 





// list des annonce accepter
exports.allAnnonce = async (req, res) => {
  try {
    const annonces = await AnnonceModel.find({ verif: true })
      .populate({ path: "logement", populate: { path: "equipement" } })
      .populate("propritaire")
      .populate("disponibilte")
      .sort({ createdAt: "descending" });
    return res.status(200).json(annonces);
  } catch (err) {
    console.log(err);
  }
};

// liste des annonce non accepter

exports.getAnnonceByVille = async (req, res) => {
  await AnnonceModel.aggregate([
    {
      $lookup: {
        from: "logements",
        localField: "logement",
        foreignField: "_id",
        as: "logement",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "propritaire",
        foreignField: "_id",
        as: "propritaire",
      },
    },
    {
      $lookup: {
        from: "disponibiltes",
        localField: "disponibilte",
        foreignField: "_id",
        as: "disponibilte",
      },
    },

    { $match: { "logement.ville": req.body.ville } },
    {
      $project: {
        _id: 1,
        logement: 1,
        propritaire: 1,
        titre: 1,
        prix: 1,
        annonceImage: 1,
        disponibilte: 1,
      },
    },
  ]).exec((err, logement) => {
    if (err) throw err;
    if (!logement){
       return res.status(500).json({ errors: "There are no courses" });

    }
    else{
      console.log(logement)
      return res.status(200).json(logement);
 
    }
    
  });


};

// annonce by id
exports.findOneAnnonce = async (req, res) => {
  const id = req.params.id;
  try {
    const annonce = await AnnonceModel.findById(id)
      .populate({ path: "logement", populate: { path: "equipement" } })
      .populate("propritaire").populate('coordinate').populate('disponibilte')
    if (annonce) {
      const idUser = annonce?.propritaire._id.toString();
      await addVueToAnnonce(id, idUser);
      return res.status(201).json(annonce);
    }
  } catch (err) {
    return res.status(500).send({ message: "error !" });
  }
};

var addVueToAnnonce = async (idAnnonce, idUser) => {
  try {
    await AnnonceModel.findOneAndUpdate(
      { _id: idAnnonce },
      {
        $addToSet: {
          vues: idUser,
        },
      },
      { new: true, omitUndefined: true }
    );
  } catch (err) {}
};



// filtrer des annonces  

exports.supprimeAnnonce = async (req, res) => {
  const id = req.params.id;
  await AnnonceModel.deleteOne({ _id: id })
    .then(res.status(201).send({ message: "annonce deleted " }))
    .catch((error) => {
      res.status(500).send({ message: "cannot find annonce" });
    });
};

exports.uploadImageAnnonce = (req, res) => {
  upload(req, res, (err) => {
    const photos = req.files;

    // check if photos are available
    if (!photos) {
      res.status(400).send({
        status: false,
        data: "No photo is selected.",
      });
    } else {
      let data = [];

      req.files.forEach(function (item) {
        data.push(item.filename);
      });
      console.log(data);
      AnnonceModel.findByIdAndUpdate(
        req.params.id,
        { annonceImage: data },
        { new: true, omitUndefined: true }
      )
        .then((annonce) => {
          if (annonce) {
            return res.status(201).send(annonce);
          }
        })
        .catch((error) => {
          return res.status(500).send({ message: error });
        });
    }
  });
};

exports.getLogement = (req, res) => {
  const id = req.params.id;
  LogementModel.findById(id).then((logement) => {
    if (logement) {
      res.status(200).json(logement);
    } else {
      res.status(500).send({ message: "error !" });
    }
  });
};

// recherche annonce

exports.searchAnnonce = async (req, res) => {
  const { ville, type, prixMin, prixMax } = req.body;
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDate();
  var c = new Date(year + 1, month, day);
 /* let match = {};
  if (ville) {
    match["logement.ville"] = ville;
  }
  if (type) {
    match["logement.type"] = type;
  }*/

let matchPrixMin = Number;
  if(prixMin){
    matchPrixMin  = prixMin
  }
  let matchPrixMax = Number
   if(prixMin){
    matchPrixMax = prixMax
  }
  
 console.log(req.body)

  await AnnonceModel.aggregate([
    {
      $lookup: {
        from: "logements",
        localField: "logement",
        foreignField: "_id",
        as: "logement",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "propritaire",
        foreignField: "_id",
        as: "propritaire",
      },
    },
    {
      $lookup: {
        from: "disponibiltes",
        localField: "disponibilte",
        foreignField: "_id",
        as: "disponibilte",
      },
    },
    //{ $match: match },
    {
      $unwind: {
        path: "$disponibilte",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        logement: 1,
        titre: 1,
        prix: 1,
        propritaire: 1,
        annonceImage: 1,
        disponibilte: 1,
        dateComp: {
          $cmp: [
            "$disponibilte.start",
            req.body.depart ? new Date(req.body.depart) : new Date(Date.now()),
          ],
        },
        dateComp1: {
          $cmp: [
            "$disponibilte.start",
            req.body.arriver ? new Date(req.body.arriver) : c,
          ],
        },
      },
    },
    {
      $match: {
        $and: [
          { dateComp: 1 },
          { dateComp1: -1 },
          { "prix": { $gt: matchPrixMin, $lte: matchPrixMax } },
          { "logement.type":type },
          { "logement.gouvernorat":ville }
        ],
      },
    },

    {
      $group: {
        _id: "$_id",
        score: { $sum: "$disponibilte" },
        logement: { $first: { $arrayElemAt: ["$logement", 0] } },
        titre: { $first: "$titre" },
        prix: { $first: "$prix" },
        disponibilte: { $first: "$disponibilte" },
        propritaire: { $first: { $arrayElemAt: ["$propritaire", 0] } },
        annonceImage: { $first: "$annonceImage" },
      },
    },
    {
      $project: {
        logement: 1,
        titre: 1,
         prix: 1,
        propritaire: 1,
        annonceImage: 1,
        disponibilte: 1,

      },
    },
  ]).exec((err, logement) => {
    if (err) throw err;
    if (!logement)
      return res.status(500).json({ errors: "There are no annonces" });
  console.log(logement)
    return res.status(200).send(logement);
  });
};





// recherche anonce 

exports.rechercheAnnonce =  async(req,res)=>{
   const { ville, type, prixMin, prixMax } = req.body;
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDate();
  var c = new Date(year + 1, month, day);

  let match = {};
  if (ville) {
    match["logement.gouvernorat"] = ville;
  }
  if (type) {
    match["logement.type"] = type;
  }
  console.log(req.body)
  try{
       await AnnonceModel.aggregate([{
      $lookup: {
        from: "logements",
        localField: "logement",
        foreignField: "_id",
        as: "logement",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "propritaire",
        foreignField: "_id",
        as: "propritaire",
      },
    },
    {
      $lookup: {
        from: "disponibiltes",
        localField: "disponibilte",
        foreignField: "_id",
        as: "disponibilte",
      },
    },
    { $match: match },
    {
      $unwind: {
        path: "$disponibilte",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        logement: 1,
        titre: 1,
        prix: 1,
        propritaire: 1,
        annonceImage: 1,
        disponibilte: 1,
        dateComp: {
          $cmp: [
            "$disponibilte.start",
            req.body.depart ? new Date(req.body.depart) : new Date(Date.now()),
          ],
        },
        dateComp1: {
          $cmp: [
            "$disponibilte.start",
            req.body.arriver ? new Date(req.body.arriver) : new Date(req.body.arriver)
          ],
        },
      },
    },
    {
      $match: {
        $or: [
          { dateComp: 1 },
          { dateComp1: -1 },
         
        ],
      },
    },

    {
      $group: {
        _id: "$_id",
        disponibilte: { $sum: "$disponibilte" },
        logement: { $first: { $arrayElemAt: ["$logement", 0] } },
        titre: { $first: "$titre" },
        prix : {$first:"$prix"},
        disponibilte: { $first: "$disponibilte" },
        propritaire: { $first: { $arrayElemAt: ["$propritaire", 0] } },
        annonceImage: { $first: "$annonceImage" },
      },
    },
    {
      $project: {
        logement: 1,
        prix: 1,
        propritaire: 1,
        annonceImage: 1,

      },
    },
  ]).exec((err, logement) => {
    if (err) throw err;
    if (!logement)
      return res.status(500).json({ errors: "There are no annonces" });
      console.log(logement)
    return res.status(200).send(logement);
  });


  }catch(err){
    res.status(500).send(err)
  }
}



// get User annonces 
exports.userAnnonce = async (req, res) => {
  const id = req.params.id;
  try {
    const annonce = await AnnonceModel.find({ propritaire: id })
      .populate({ path: "logement", populate: { path: "equipement" } })
      .populate("propritaire");

    return res.status(201).send(annonce);
  } catch (err) {
    return res.status(500).send(err);
  }
};

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






