//import React from 'react'
import Menu_button from "../components/Menu_button"
import { useState,useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import receiveInitialData from "../functions/receiveInitialData";
import { useTranslation } from "react-i18next";
import ButtonSubmit from "../components/ButtonSubmit";
import Alreadyin from "../components/AlreadyIn";



const JoinRoom = () => {

  const {t} =useTranslation();

  const [roomName, setRoomName] = useState('');
  const [playerName, setPlayerName] = useState ('');
  const {id} = useParams();
  const navigate = useNavigate();

  /// JOIN ROOM
  const joinRoomMain = async (namedRoom) => {
    
    try {
      
      const lang = localStorage.getItem('i18nextLng');
      localStorage.clear();
      localStorage.setItem('i18nextLng',lang)

      const res = await fetch('/api/rooms/join', {
          method: 'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify(namedRoom)
      }) 
      const data = await res.json();
      //receiveInitialData(data);
      
      if(data.roomname!=undefined){
        receiveInitialData(data);
        return {success:true};
      } else {
        return {success:false};
      };
    } catch (error) {
        console.error('Error:',error);
        return {success:false};        
    }
  }
  
  //Use Effect
  useEffect(()=>{
    if(id!=null)
      {
        setRoomName(id);
      }
    }, [id]);

  // Join room function start
  const joinRoomFunc = async (e) => {
    e.preventDefault();
  
    const room = {
      roomname: roomName.toUpperCase(),
      username: playerName
    };

    const result = await joinRoomMain(room);
    if(result.success) {
      console.log('successfull');
      navigate('/room');
    }else{
      console.log('nooot');
    };

    return;
  }



  ////
  //// JOIN ROOM PAGE

  return (
    <div >
      <div className="space-y-4">
      <Alreadyin /> 
        <h1 className="text-center text-4xl text-white font-bold md:text-left">
                {t('join room')} {id}
        </h1>
        
        <form onSubmit={joinRoomFunc} className="space-y-4 text-center text-xl md:text-left">

            {/* Room name */}
            <div className="space-y-2">
              <p className="text-white">
                {t('join room name')}
              </p>
              <input 
                type="text"
                name="RoomName" 
                id="roomName" 
                className="border w-40 uppercase"
                required
                value={roomName}
                onChange={(e)=> setRoomName(e.target.value)}
              />
            </div>

            {/* Player name */}
            <div className="space-y-2">
              <p className="text-white">
                {t('join user name')}
              </p>
              <input 
                type="text"
                name="PlayerName" 
                id="playerName" 
                className="border w-40" 
                required
                value={playerName}
                onChange={(e)=> setPlayerName(e.target.value)}
              />
            </div>

            <div className='flex justify-center md:justify-start'>
                <button type="submit">
                  <ButtonSubmit title={t("join room")} img_id={1}/>
                </button>
            </div>
        </form>
        {/* back button */}
        <Menu_button title={t("back")} img_id={3} link='/' />
      </div>
    
      
    </div>
  )
}


export default JoinRoom