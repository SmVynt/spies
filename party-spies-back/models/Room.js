const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomname: {
        type: String,
        required: true
    },
    settings: {
        tasksPerUser: {
            type: Number,
            default: 3
        },
        maxTasksPerUser: {
            type: Number,
            default: 7
        },
        pack: {
            type: Number,
            default: 1
        },
        duration: {
            type:Number,
            default: 60 // in Minutes!
        },
        endsAt: {
            type:Date,
            default:Date.now // in milliseconds
        }
    },
    participants: [
        {
            username: String,
            points: {
                type: Number,
                default: 0
            },
            role: {
                type: String,
                defaut: 'player'
            },
            completedTasks: [],
            tasks: []// Array of given tasks.
        }
    ],
    tasks: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type:Date,
        required:true
    },
    isInPlay: {
        type:Boolean,
        default: true
    }
});

//RoomSchema.index({createdAt:1},{expiresAfterSeconds:60});

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;