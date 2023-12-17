const AnnonceModel = require('../models/annonce');
const LogementModel = require('../models/logement');
const DisponibilteModel = require('../models/disponibilte')
const Moment = require('moment')

MomentRange = require("moment-range"), 
moment = MomentRange.extendMoment(Moment); 



exports.disponibilte = async(req,res)=>{
     const tab =[]
	const id = req.params.id ;
	const { start, end, price } = req.body;
	range = moment().range(new Date(start), new Date(end)), /*can handle leap year*/ 
    array = Array.from(range.by("days")); /*days, hours, years, etc.*/ 
    for (var i = 0; i < array.length; i++) {
    	const disponibilte = new DisponibilteModel({
    		start : array[i],
    		 price: price,
    		annonce : id
    	})
    const newDisponiblite =	await disponibilte.save()
     tab.push(newDisponiblite)
    }
    const annonce =   await AnnonceModel.findOneAndUpdate(
      { _id: id },
      {
          $push: {
          disponibilte: tab,
        },
      },
      { new: true, omitUndefined: true }
    )

	
	return res.json(tab)
    
}



exports.getDisponibilte = async(req,res)=>{
	const id = req.params.id
	try{
       const annonce = await AnnonceModel.findById({_id:id})

       if(annonce){
       	  tabDispo = []
       	  tab = annonce.disponibilte ;
       	  date = Date ;
       	  for (var i = 0; i < tab.length; i++) {
       	  	 date= await getDisponibite(tab[i])
             tabDispo.push(date)
       	  }
       	  return res.status(201).send(tabDispo)
       }
	}catch(err){
		return res.status(500).send(err)
	}
}


var getDisponibite = async(id)=>{
   let data = Date ;
   const disponibilte = await DisponibilteModel.findById({_id:id})
   if(disponibilte){
      date = disponibilte.start;
    }
    return date;


}

/// comparer 2 date 

var comparerDateDepart=(date1 , date2)=>{
  try{
    if((date1.getDate()>=date2.getDate()) && (date1.getMonth() >= date2.getMonth()) && (date1.getFullYear()>=date2.getFullYear())){
    return true
  
  }
  else{
    return false
  }
  }catch(ex){
    return ex

  }
 
}
var comparerDateArriver=(date1 , date2)=>{
  try{
     if((date1.getDate()<=date2.getDate()) && (date1.getMonth() <= date2.getMonth()) && (date1.getFullYear()<=date2.getFullYear())){
    return true
  
  }
  else{
    return false
  }


  }catch(ex){
    return ex
  }
 }


/// verifer la disponibilte d'une annonce ///

exports.verifierDispo = async(req,res)=>{
  const id = req.params.id
  const { annonce} = req.body
  let depart = new Date('2022-05-20')
  let arriver = new Date('2022-05-31')
  tabDispo = []
  let verif = Boolean 
   try{
       const disponibilte = await DisponibilteModel.find({annonce:annonce})
       tabDispo =  disponibilte
      
         for (var i = 0; i < tabDispo.length; i++) {
          if(tabDispo[i].etat==true){
          if(await comparerDateArriver(tabDispo[i].start,arriver)){
               verif = true                 
           }else{
            verif = false   
           }
          }
          else{
            verif = false
          }
           

         }
       
           res.send(verif)

   }catch(err){

    return res.status(500).send(err)
   }

}


