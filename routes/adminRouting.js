
const annonceController = require('../app/controllers/annonceController') ;
const AdminController = require('../app/controllers/AdminController') ;


 const express =  require('express');
 const router = express.Router();
 

 
router.get('/accepterAnnonce', annonceController.annonceNonAccepter);

router.delete("/annonce/:id" ,annonceController.supprimeAnnonce);

router.put('/acceptAnnonce', annonceController.acceptAnnonce);
router.delete('/annonce/delete/:id', annonceController.supprimeAnnonce);


router.get('/countAnnoce', annonceController.NumberOfAnnonceNonAccepter);




/// logement by ville 
router.get('/logementByVille', AdminController.logementGroupByVille);
router.get('/annoncesParMois', AdminController.annoncesGroupByMois);






 

module.exports =  router ;