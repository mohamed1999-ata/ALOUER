
const AnnonceModel = require("../models/annonce");
const AdressModel = require("../models/adress");

const XMLHttpRequest = require('xhr2');


exports.getLongLat = async(req,res)=>{
const annonce = req.params.id
const adress = req.body.adress
const gouvernorat  = req.body.gouvernorat
const ville = req.body.ville

const data = "tunisia "+gouvernorat+" "+ville+" "+adress

console.log(data)

try{
 var xmlhttp = new XMLHttpRequest();
 var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" +data;
 xmlhttp.onreadystatechange = async function()
 {
   if (this.readyState == 4 && this.status == 200)
   {
    var myArr = JSON.parse(this.responseText);
    if(myArr.length>0){
     // await  saveCoordinate(myArr[0]?.lon,myArr[0]?.lat,annonce)
     console.log(myArr[0].lon)

    }
    res.send(myArr)
   }
 };
 xmlhttp.open("GET", url, true);
 xmlhttp.send();
}catch(err){
  res.status(500).send(err)
}



}


exports.saveCoordinate = async(req,res)=>{
         const {annonce , long,lat} = req.body
         console.log(req.body)
         try{
     const adress = new AdressModel({
         	longitude : long ,
         	latitude : lat
         })
           await  adress.save()

      const responce = await AnnonceModel.updateOne(
      { _id:annonce },
      {
       coordinate:adress
      })

      if(responce){
      	console.log(responce)
      }

    }catch(err){
          res.status(500).send(err)
     }
}
