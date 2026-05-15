const Room = require('../models/Room');
const {verify} = require('../controllers/verifyUserController');


const getParticipantsList = async(req,res) => {
    
    const token = req.headers['authorization'];
    const {roomname, username} = req.body;

    const verified = await verify(token,roomname,username);

    if(!verified){
        console.log("token is wrong");
        return res.status(404).json({message: 'token is not correct.'});
    }

    try {
        const room = await Room.findOne({roomname: roomname});

        if (!room){
            return res.status(404).json({message: 'The room is not found.'});
        }
        
        const participantsNames = room.participants.map(a => a.username);
        return res.json({participantsNames});
    } catch (error){
        res.status(500).json({message:'Failed to access participants list', error});
    }
};

module.exports = getParticipantsList;

