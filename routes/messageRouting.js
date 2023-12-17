const { addMessage, getMessages , getMessageByAnnonce, getAllCurrentUserMessage} = require("../app/controllers/MessageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.get("/getmsgByAnnonce/:id", getMessageByAnnonce);
router.post("/getAllCurrentUserMessage", getAllCurrentUserMessage);

module.exports = router;