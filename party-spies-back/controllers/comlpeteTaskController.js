const Room = require('../models/Room');
const {verify} = require('../controllers/verifyUserController');

const completeTask = async(req,res) => {

    /* -- INITIAL CHECK -- */
    const token = req.headers['authorization'];
    const {roomname, username, task, success} = req.body;

    const verified = await verify(token,roomname,username);

    if(!verified){
        console.log("token is wrong");
        return res.status(404).json({message: 'token is not correct.'});
    }
    if(!task.taskId){
        console.log("task is not sent");
        return res.status(404).json({message: "task doesn't work."});
    }
    if(success==undefined){
        console.log("no success");
        return res.status(404).json({message: "no success?"});
    }
    

    /* -- INITIAL CHECK -- */

    try {
        const room = await Room.findOne({roomname: roomname});

        if (!room){
            return res.status(404).json({message: 'The room is not found.'});
        }
        
        if (room.isInPlay==false){
            return res.status(403).json({message: 'The room is already closed. Please, refresh the page.'});
        }

        // trying to find the participant
        const participant = room.participants.find(p => p.username === username);
        

        if (!participant) {
            return res.status(404).json({message:'The participant with such name is not found'});
        }

        //console.log(participant);
        // checking if participant has this task on the list
        const completedTask = participant.tasks.find(p => p.taskId===task.taskId);

        console.log(!success);
        if(!completedTask) {
            console.log('dont hace this task')
            return res.status(404).json({message:'Theres no task in the list of this participant'});
        }

        const alreadyCompleted = participant.completedTasks.find(p => p.taskId===task.taskId);
        if(alreadyCompleted!=undefined) {
            console.log('already pushed')
            return res.status(404).json({message:'Theres no task in the list of this participant'});
        }
        
        if(success){
            participant.points+=task.points;
        }
        const taskToSave = task;
        taskToSave.succeed = success;
        // pushing completed task to the leaderboard
        participant.completedTasks.push(taskToSave);

        await room.save();
        res.json({message: 'Task completed', success:true});
    } catch (error){
        res.status(500).json({message:'Failed to submit completed task', error});
    }
};

module.exports = completeTask;
