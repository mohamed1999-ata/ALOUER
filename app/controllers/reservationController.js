const ReservationModel = require("../models/reservation");
const AnnonceModel = require("../models/annonce");
const LogementModel = require("../models/logement");
const DisponibilteModel = require("../models/disponibilte");

const {isAfter,isBefore,isSameDay } = require('date-fns')


exports.addReservation = async (req, res) => {
  const { annonce, locataire, arriver, depart, nbInvite, prix_final } = req.body;


  const reservation = new ReservationModel({
       locataire: locataire,
       annonce: annonce,
       depart: new Date(depart),
       arrive: new Date(arriver),
       prix_final: prix_final,
     });
     reservation
       .save()
       .then((reservation) => {
         if (reservation) {
           return res.status(200).send(reservation);
         } else {
           return res
             .status(500)
             .send({ message: " error !! cannot add reservation!!" });
         }
       })
       .catch((err) => {
         return res.status(500).send(err);
       });

};

/// get disponiblte by id





var modifierDispo = async( depart , arriver ,idAnnonce )=>{

    const disponibltes = await getDisponibite(idAnnonce)
    let disponibilteUpdated = []
    for (var i = 0; i < disponibltes.length; i++) {
      if(comparerDate(depart,arriver,disponibltes[i].start)){
         const dispo = await DeleteDisponibilite(disponibltes[i]._id)
         disponibilteUpdated.push(dispo)
        }else{
        }
    }
    return disponibilteUpdated

}


 var comparerDate = (depart , arriver , date)=>{
  
  if((isAfter(new Date(date),depart)|| isSameDay(new Date(date),depart)) && (isBefore(  new Date(date),arriver)|| isSameDay(new Date(date),arriver))){

      return true
  }
  else{
    return false
  }
 }

var getDisponibite = async (id) => {
    const disponibilte = await DisponibilteModel.find({ annonce: id });
  
  return disponibilte;

 
  };




var updateAnnonce = async(id , data)=>{
   await AnnonceModel.findByIdAndUpdate(id,
         {
          $push: {
          disponibilte: data,
            
            }
          },
        { new: true, omitUndefined: true }).populate('disponibilte')
   .then(annonce=>{
     if(annonce){
      return annonce
     }
   }).catch(err=>{
    return false
   })
}




var DeleteDisponibilite = async(id)=>{

  try{
      const disponiblte = await DisponibilteModel.findOneAndUpdate(
        {_id : id},
        {etat : false},
        { new: true, omitUndefined: true }) 
       return disponiblte

  }catch(err){

  }
     


}




// by id

exports.getReservation= async(req, res) => {

  const id = req.params.id 

  try{
   const reservation = await  ReservationModel.findById({_id : id})
   if(reservation){
     res.status(201).send(reservation)
   }
  }catch(err){
    res.status(500).send(err)
  }
};





exports.getAnnonceResrvation = async(req,res)=>{
  const annonce = req.body.annonce
  try{

    const result = await ReservationModel.find({annonce:annonce})
      res.status(201).send(result)
  }catch(err){
    res.status(500).send(err)
  }
}


exports.AcceptReservation = async (req,res)=>{
 
        const reservationId = req.body.reservationId
        const annonceId  = req.body.annonceId
        const  depart = req.body.depart
        const  arriver  = req.body.arriver

  try{
    console.log(reservationId)
    console.log(annonceId)
 
     const resultResvation = await AnnonceModel.findById({
    _id: annonceId,
      }).populate('disponibilte')
    if (resultResvation) {
      let  tab=resultResvation.disponibilte;
     await modifierDispo(new Date(new Date(Date.now())) , new Date('2022-06-04'),annonceId)
      }
   const result = await ReservationModel.updateOne(
      { _id: reservationId },
      {
        etat : true
      },
      { new: true, omitUndefined: true }
    );
    if(result){
             res.status(201).send({message : 'demmade de reservation  est accepter !'})

    }else{
             res.status(500).send("cannot find reservation !")

    }
   
  }catch(err){
    res.status(500).send(err)
  }

  }

  exports.AnnulerReservation = async (req,res)=>{
        const reservationId = req.body.reservationId
        const annonceId  = req.body.annonceId
        const  depart = req.body.depart
        const  arriver  = req.body.arriver

  try{
     const updateAnnonceDispo = await AnnonceModel.findById({
    _id: annonceId,
      }).populate('disponibilte')
    if (updateAnnonceDispo) {
      console.log(updateAnnonceDispo)
      let  tab=updateAnnonceDispo.disponibilte;
     await modifierDispo2(new Date(new Date('2022-06-03')) , new Date('2022-06-04'),annonceId)
      }

      const reservationUpdate = await ReservationModel.findOneAndUpdate(
        {_id : reservationId},
        {etat : false},
        { new: true, omitUndefined: true }) 
      res.status(201).send(reservationUpdate)

      
  }catch(err){
    res.status(500).send(err)
  }

  }
  



  var modifierDispo2 = async( depart , arriver ,idAnnonce )=>{

    const disponibltes = await getDisponibite(idAnnonce)
    let disponibilteUpdated = []
    for (var i = 0; i < disponibltes.length; i++) {
      if(comparerDate(depart,arriver,disponibltes[i].start)){
         const dispo = await UdateDisponibilite(disponibltes[i]._id)
         disponibilteUpdated.push(dispo)
        }else{
        }
    }
    return disponibilteUpdated

}




var UdateDisponibilite = async(id)=>{

  try{
      const disponiblte = await DisponibilteModel.findOneAndUpdate(
        {_id : id},
        {etat : true},
        { new: true, omitUndefined: true }) 
       return disponiblte

  }catch(err){

  }
     


}
   









     exports.sejours = async(req,res)=>{
          const locataire = req.params.id 
          try{
          const reservation  = await  ReservationModel.find({locataire:locataire})
          .populate({
            path: 'annonce',
            populate:{path : "logement" }})
          .sort({createdAt: "descending"}).limit(4)
          res.status(201).send(reservation)
          }catch(err){
            console.log(err)
              res.status(500).send(err)
          }
     }
      exports.sejoursAccepter = async(req,res)=>{
          const locataire = req.params.id 
          try{
          const reservation  = await  ReservationModel.find({locataire:locataire,etat:true})
          .populate({
            path: 'annonce',
          select:
          'titre prix ville',
          })
          .sort({createdAt: "descending"}).limit(10)
          res.status(201).send(reservation)
          }catch(err){
              res.status(500).send(err)
          }
     }

   exports.getReservationByAnnonce = async(req,res)=>{
    const annonce  = req.params.id
    try{
     const  reservation =  await ReservationModel.find({annonce:annonce}).populate({
            path: 'annonce',
            populate:{path : "logement" }}).populate("locataire")
          .sort({createdAt: "descending"}).limit(4)
     res.status(201).send(reservation)
    }catch(err){

      res.status(500).send(err)

    }
   }


