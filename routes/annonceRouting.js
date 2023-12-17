
const annonceController = require('../app/controllers/annonceController') ;
const geocodeController = require('../app/controllers/geocodeController') ;
const disponibilteController = require('../app/controllers/DisponibilteController') ;

 const express =  require('express');
 const router = express.Router();
 

 
router.post('/annonce/new/:id', annonceController.newAnonnce);
router.get('/annonces', annonceController.allAnnonce);
router.get('/accepterAnnonce', annonceController.annonceNonAccepter);

router.get('/annonce/:id', annonceController.findOneAnnonce);
router.put("/annonce/edit/:id" ,annonceController.updateAnnonce);
router.delete("/annonce/:id" ,annonceController.supprimeAnnonce);
router.post("/annonce/uploadImageAnnonce/:id" ,annonceController.uploadImageAnnonce);

router.get('/logement/:id', annonceController.getLogement);

// recherche annonces 
router.post('/rechercheAnnonce', annonceController.searchAnnonce);
router.post('/chercherAnnonces' , annonceController.rechercheAnnonce)



router.put('/acceptAnnonce', annonceController.acceptAnnonce);
router.delete('/annonce/delete/:id', annonceController.supprimeAnnonce);
router.post('/annonceByVille', annonceController.getAnnonceByVille);
router.post('/addDisponibilte/:id', disponibilteController.disponibilte);
router.get('/disponibilte/:id', disponibilteController.getDisponibilte);

// verif dispo
router.get('/verifDisponibilte', disponibilteController.verifierDispo);



// annonce group by villle 




// get &  save  long Lat

router.post('/getLongLat', geocodeController.getLongLat);
router.post('/saveLongLat', geocodeController.saveCoordinate);
 

module.exports =  router ;