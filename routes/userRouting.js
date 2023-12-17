

const  userController = require('../app/controllers/userController') ;
const annonceController = require('../app/controllers/annonceController') ;



 const express =  require('express');
 const router = express.Router();
 

router.post("/edit/:id",userController.editUser) ;
router.get("/oneUser/:id",userController.userBYid) ;
router.get("/profil/:id",userController.profil) ;
router.get("/userAnnonce/:id",annonceController.userAnnonce) ;
router.get("/AnnonceNonPublier/:id",annonceController.userAnnonceNonPublier) ;
router.get("/allUsers",userController.getAllUsers) ;

router.put("/uploadProfile/:id" ,userController.uploadImage );


router.get("/CountUsers" ,userController.countUsers );










module.exports =  router ;