import Menu_button from "../components/Menu_button"
import Task from "../components/Task";
import { useEffect,useState } from "react";
import TaskCompleted from "../components/TaskCompleted";
import PropTypes from 'prop-types';
import Button from "../components/Button";
import CloseRoom from "../components/CloseRoom";
import { useTranslation } from "react-i18next";

const RoomPage = ({role='player'}) => {

    const {t} = useTranslation();

    const [tasks, setTasks] = useState([]);
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // useEffect
    useEffect (() => {
        const storedTasks = localStorage.getItem('currentTasks');
        if (storedTasks) {
            try {
                setTasks(JSON.parse(storedTasks));                
            } catch (error) {
                console.error("No data in Local Storage", error);
            }
        };
        
        const storedTasksCompleted = localStorage.getItem('completedTasks');
        if (storedTasksCompleted) {
            try {
                setTasksCompleted(JSON.parse(storedTasksCompleted));                
            } catch (error) {
                console.error("No data in Local Storage", error);
            }
        }

    }, []);

    // useEffect Timer
    useEffect (() => {
        const endTime = localStorage.getItem('gameEndsAt');
        if(!endTime){return;}

        const updateCountdown = () => {
            const now = Date.now();
            const remainingTime = Math.max (0, new Date(endTime) - now);
            setTimeLeft (remainingTime);

            if(remainingTime<=0) 
                {
                    clearInterval(intervalId)
                    setTimeout(()=>{
                        window.location.reload();
                    }, 2000);
                }
        };

        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);

        return () => clearInterval(intervalId);

    }, []);


    const formatLeadingZero = (num) => num.toString().padStart(2,'0');

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms/1000);
        const hours = formatLeadingZero(Math.floor(totalSeconds/3600));
        const minutes = formatLeadingZero(Math.floor((totalSeconds%3600)/60));
        const seconds = formatLeadingZero(totalSeconds % 60);
        return `${hours}:${minutes}:${seconds}`;
    }
   
    //Sending task completion to the server
    const handleTaskDone = async (index, task, success=true) => {
        const currentTasks = JSON.parse(localStorage.getItem('currentTasks')) || [];
        const allTasks = JSON.parse(localStorage.getItem('tasks'))|| [];
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

        const res = await fetch('/api/rooms/complete', {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
              'authorization':localStorage.token
            },
            body: JSON.stringify({roomname:localStorage.roomname,username:localStorage.username,task,success})
          });
          
        const data = await res.json();
        if (data.success==undefined){
          return;
        }

        console.log('Done!');
        const completedTask = currentTasks[index];
        completedTask.succeed = success;
        currentTasks.splice(index,1);
        console.log(completedTask);

        completedTasks.push(completedTask);

        if (allTasks.length>0){
            const newTask = allTasks.shift();
            currentTasks.push(newTask);
        }

        localStorage.setItem('currentTasks',JSON.stringify(currentTasks));
        localStorage.setItem('completedTasks',JSON.stringify(completedTasks));
        localStorage.setItem('tasks',JSON.stringify(allTasks));

        setTasks(currentTasks);
        setTasksCompleted(completedTasks);
    };


    ////
    //// ROOM PAGE
    return (
        <div className="space-y-6">
           <div>      
                <h1 className="text-center text-2xl text-white font-bold md:text-left">
                    {t("room")}
                </h1>
                <h1 className="text-center text-6xl text-spyYellow font-bold md:text-left">
                        {localStorage.getItem('roomname')}
                </h1>
                <Menu_button title={t("invite")} img_id={1} link={"/join/"+localStorage.getItem('roomname')}/>
            </div>

            <div>      
                <h1 className="text-center text-2xl text-white font-bold md:text-left">
                    {t("room time left")}
                </h1>
                <h1 className="text-center text-4xl text-spyYellow font-bold md:text-left">
                        {formatTime(timeLeft)}
                </h1>
            </div>

            {tasks.length > 0? (
                        <>
                        <h1 className="text-center text-2xl text-white font-bold md:text-left">
                            {t("room hey")}
                            {localStorage.getItem('username')}
                            {t("room here")}
                        </h1>
                        <div className="flex flex-wrap gap-4">
                            {tasks.map((task, index) => (
                                <Task 
                                    key = {index}
                                    task = {task}
                                    callDone={() => handleTaskDone(index, task, true)} 
                                    callFail={() => handleTaskDone(index, task, false)}/>
                            ))}
                        </div>
                        </>
                        ) : (
                            <div className="text-center text-white text-2xl font-bold md:text-left">
                                {t("room well")}
                            </div>
                        )
            }

            {tasksCompleted.length > 0? (
                <>
                <h1 className="text-center text-2xl text-white font-bold md:text-left">
                    {t("room completed")}
                </h1>
                <div className="flex flex-wrap gap-4">
                    {
                    tasksCompleted.map((task, index) => (
                        <TaskCompleted 
                            key = {index}
                            task = {task}/>
                    ))}
                </div>
                </>
                ) : (
                    <p className="text-center text-2xl text-white font-bold md:text-left">
                        {t("room no completed")}
                    </p>
                )
            }
            
            {role=='host'?
                <>
                    <p className="text-center text-2xl text-white font-bold md:text-left">
                        {t("room host message")}
                    </p>
                    <Button title={t("room finish")} img_id={1} click={openModal}/>
                    <CloseRoom isOpen={isOpen} onClose={closeModal}/>
                </>
                :
                <div />
            }
            <Menu_button title={t("back")} img_id={3} link="/"/>
        </div>
    )
}

RoomPage.propTypes ={
    role: PropTypes.string
}

export default RoomPage