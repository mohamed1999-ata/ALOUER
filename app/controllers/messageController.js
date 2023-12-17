const Messages = require("../models/messages");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to , annonce} = req.body;
   console.log(from)
   console.log(to)
   console.log(annonce)
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
      annonce : annonce
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        annonce : msg.annonce,
        date : msg.createdAt

      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message , annonce } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      annonce : annonce
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};


module.exports.getMessageByAnnonce = async(req , res, next)=>{
      try {
    const annonce = req.params.id;
    const {from} = req.body;

    const messages = await Messages.find({
       annonce:annonce
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      console.log(msg)
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        annonce : msg.annonce,
        date : msg.createdAt
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }}



  module.exports.getAllCurrentUserMessage =  async(req,res)=>{
    const {user , annonce} = req.body
   
    await Messages.find({ "sender": user,annonce:annonce }).limit(10)
    .exec(function(err,messsages) {
        if (err) throw err;
            /*console.log( JSON.stringify( messsages, undefined, 4 ) );*/
            res.status(201).send(JSON.stringify( messsages, undefined, 4 ))
    });
  }