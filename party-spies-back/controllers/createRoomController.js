const Room = require('../models/Room');
const jwt = require('jsonwebtoken');
const allTasksEn = require('../local-db/tasks-en');
const allTasksRu = require('../local-db/tasks-ru');
const allTasksDe = require('../local-db/tasks-de');
const {getTasks} = require('../utils/getTasks');
const mongoose = require('mongoose');


const generateRoomCode = ({codeLength=4}) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    var roomCode = '';
    for (let i=0; i<codeLength; i++) {
      roomCode +=characters.charAt(Math.floor(Math.random()*characters.length))
    }
    return roomCode;
  }



const createRoom = async (req,res) => {
    try{

        if(!(mongoose.connection.readyState === 1)){
            return res.status(505).json({
                mesage: 'Database is out of reach'
            })
        
        }

        const {settings,username,lang} = req.body;

        console.log("room is being created!");/*
        if(!roomname) {
            return res.status(400).json({message:'The name of the room is required'});
        }*/

        
        let allTasks = [];
        switch(lang) {
            case 'de':
                allTasks = allTasksDe;
                break;
            case 'ru':
                allTasks = allTasksRu;
                break;
            case 'en':
                allTasks = allTasksEn;
                break;
            default:
                allTasks = allTasksEn;
        }

        let roomname = generateRoomCode({codeLength:4});
        const sameroom = await Room.findOne({roomname:roomname});
        if (sameroom){
            
            console.log("There's already a room with such name");
            roomname = generateRoomCode({codeLength:6});
        }


        const tasks = allTasks.filter(a => a.pack===settings.pack);

        // Generating token
        const token = jwt.sign(
            {username:username, roomname:roomname},
            process.env.JWT_SK,
            {expiresIn: '24h'}
        );

        const selectedTasks = getTasks({tasks,count:settings.maxTasksPerUser});

        const endsAt = new Date(Date.now() + settings.duration*60000);

        const room = new Room({
            roomname,
            settings:{
                tasksPerUser: settings.tasksPerUser,
                maxTasksPerUser: settings.maxTasksPerUser,
                pack: settings.pack,
                duration: settings.duration,
                endsAt: endsAt
            },
            tasks, 
            participants: [
                {
                    username,
                    role: 'host',
                    tasks: selectedTasks
                }
            ],
            expiresAt: new Date(Date.now() + 3600000*48) // expires in 48 hours.
        });

        //room.settings.endsAt = Date.now() + room.settings.duration*60000;
        console.log(room.settings.endsAt);
        await room.save();
        

        res.status(201).json({
            message: 'The room is created',
            token,
            username,
            roomname,
            mTPU:room.settings.maxTasksPerUser, 
            tPU:room.settings.tasksPerUser,
            selectedTasks,
            gameEndsAt: room.settings.endsAt
        });
    } catch (error) {
        res.status(500).json({message: 'The room is failed to create', error});
    }  

};

module.exports = createRoom;

