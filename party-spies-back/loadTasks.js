require('dotenv').config();

const mongoose = require('mongoose');
const Task = require('./models/Task');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(' Successfully connected!'))
.catch(err => console.error('Connectivity error',err));

const tasks = [
    {description: "Task_01", points: 1, timeLimit: 0},
    {description: "Task_02", points: 1, timeLimit: 0},
    {description: "Task_03", points: 1, timeLimit: 0},
    {description: "Task_04", points: 1, timeLimit: 0},
    {description: "Task_05", points: 1, timeLimit: 0},
    {description: "Task_06", points: 2, timeLimit: 0},
    {description: "Task_07", points: 2, timeLimit: 0},
    {description: "Task_08", points: 2, timeLimit: 0},
    {description: "Task_09", points: 3, timeLimit: 0},
    {description: "Task_10", points: 3, timeLimit: 0},
    {description: "Task_11", points: 3, timeLimit: 0},
    {description: "Task_12", points: 3, timeLimit: 0},
];

const loadTasks = async() => {
    try {
        await Task.insertMany(tasks);
        console.log("Successully added");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error while loading tasks", error);
    }
};

loadTasks();