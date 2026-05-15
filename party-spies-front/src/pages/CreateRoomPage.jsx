//import React from 'react'
import Menu_button from "../components/Menu_button"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import receiveInitialData from "../functions/receiveInitialData";
import Button from "../components/Button";
import { useTranslation } from 'react-i18next';
import ButtonSubmit from "../components/ButtonSubmit";
import Alreadyin from "../components/AlreadyIn";

const CreateRoom = () => {

  const {t} =useTranslation();

  const [maxTasksPerUser, setMaxTasksPerUser] = useState('8');
  const [tasksPerUser, setTasksPerUser] = useState('4');
  const [duration, setDuration] = useState("240");
  const [language, setLanguage] = useState(localStorage.getItem("i18nextLng"));
  const [message, setMessage] = useState ('');
  const [pack, setPack] = useState ('1');
  const [hostUsername, setHostUsername] = useState("Spymaster");
  const navigate = useNavigate();

  //CREATE ROOM
  const createRoom = async (newRoom) => {
    
    try {
    
      const lang = localStorage.getItem('i18nextLng');
      localStorage.clear();
      localStorage.setItem('i18nextLng',lang)

      // Creating the room
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify(newRoom)
      })
      
      const data = await res.json();
      if (data.roomname==undefined){
        return{success:false};
      }
      
      // Filling out the localStorage
      receiveInitialData(data);

      return {success:true};
      
    } catch (error) {
      console.error('Error:',error);
      return {success:false};        
    };
  };


  //Create room function. We're generating room object
  const generateRoom = async (e) => {
    e.preventDefault();
  
    const newRoom = {
      roomname: "ROOM",
      settings: {
        tasksPerUser: Number (tasksPerUser),
        maxTasksPerUser: Number(maxTasksPerUser),
        pack: Number (pack),
        duration: Number(duration)
        },
      username: String (hostUsername),
      lang: String (language)
    };

    const result = await createRoom(newRoom);
    if(result.success) {
      console.log('successfull');
      navigate(`/join/${localStorage.roomname}`);
    }else{
      setMessage('Failed to create room. Please try again later.');
      console.log('nooot');
    };


  }


  ////
  //// CREATE ROOM PAGE

  return (
    <div>
      <div className="space-y-4">
        <Alreadyin /> 
        <h1 className="text-center text-4xl text-white font-bold md:text-left">
          {t("create room")}
        </h1>
        <form onSubmit={generateRoom} className="space-y-6 text-center text-xl md:text-left">

            {/* how long would game go? */}
            <div className="space-y-2">
              <p className="text-white">
                {t("create duration")}
              </p>
              <select 
                name="duration" 
                id="duration" 
                className="border w-40" 
                value={duration}
                onChange={(e)=> setDuration(e.target.value)}
              > 
                <option value="60">1</option>
                <option value="120">2</option>
                <option value="180">3</option>
                <option value="240">4</option>
                <option value="300">5</option>
                <option value="360">6</option>
                <option value="720">12</option>
                <option value="1440">24</option>
              </select>
            </div>
            
            {/* What language? */}
            <div className="space-y-2">
              <p className="text-white">
                {t("create language")}
              </p>
              <select 
                name="lang" 
                id="lang" 
                className="border w-40" 
                value={language}
                onChange={(e)=> setLanguage(e.target.value)}
              > 
                <option value="en">{t("create language en")}</option>
                <option value="de">{t("create language de")}</option>
                <option value="ru">{t("create language ru")}</option>
              </select>
            </div>
            

            {/* Host's name */}
            <div className="space-y-2">
              <p className="text-white">
                {t("create host name")}
              </p>
              <input 
                name="HostUsername" 
                id="hostUsername" 
                className="border w-40" 
                value={hostUsername}
                onChange={(e)=> setHostUsername(e.target.value)}
              />
            </div>

            {/* Message */}
            <div className="text-spyYellow">
              {message}
            </div>
            {/* Create button */}
            <div className='flex justify-center md:justify-start'>
              <button type="submit">
                <ButtonSubmit title={t("create start")} img_id={3}/>
              </button>
            </div>
        </form>
        <Menu_button title={t("back")} img_id={3} link='/' />
      </div>
      {/* back button */}
  
    </div>
  )
}


export default CreateRoom