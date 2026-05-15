const Room = require('../models/Room');
const {verify} = require('./verifyUserController');

const closeRoom = async(req,res) => {

    /* -- INITIAL CHECK -- */
    const token = req.headers['authorization'];
    const {roomname, username} = req.body;

    const verified = await verify(token,roomname,username);

    if(!verified){
        console.log("token is wrong");
        return res.status(404).json({message: 'token is not correct.'});
    }   
    console.log('verified');

    try {
        const room = await Room.findOne({roomname: roomname});

        if (!room){
            console.log('room is not found');
            return res.status(404).json({message: 'The room is not found.'});
        }
        console.log('room is found');

        if (room.isInPlay==false){
            console.log('room is already closed');
            return res.status(404).json({message: 'The room is already closed.'});
        }

        // trying to find the participant
        const participant = room.participants.find(p => p.username === username);
        console.log('searching for user');
        if (!participant) {
            console.log('not host');
            return res.status(404).json({message:'The participant with such name is not found'});
        }
        console.log('user is found');

        if (participant.role!='host'){
            return res.status(403).json({message:"You don't have a right to close the room. Create your own room and close it as much as you like"});
        }
        console.log('user is host');
        room.isInPlay = false;
        console.log(room.isInPlay);
        await room.save();
        console.log('saved');
        res.json({message: 'Room closed', success:true});
    } catch (error){
        console.error("smth went wrong", error)
        res.status(500).json({message:'Failed to close the room', error});
    }
};

module.exports = {closeRoom};
