
const reservationController = require('../app/controllers/reservationController') ;

 const express =  require('express');
 const router = express.Router();
 

 // cree  reservation 
router.post('/reservation/new', reservationController.addReservation);
 
 // get reservation by id
router.get('/reservation/:id', reservationController.getReservation);

// annuler /  annuler reservation 
router.put('/acceptReservation', reservationController.AcceptReservation);
router.put('/annulerReservation', reservationController.AnnulerReservation);


router.get('/AnnonnceReservation/:id', reservationController.getReservationByAnnonce);
router.get('/AnnonnceReservation/:id', reservationController.getReservationByAnnonce);

router.get('/sejourAccepter/:id', reservationController.sejoursAccepter);
router.get('/sejour/:id', reservationController.sejours);





module.exports =  router ;