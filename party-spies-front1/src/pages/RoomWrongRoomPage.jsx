import { useState, useEffect } from "react";
import WrongRoom from "./WrongRoomPage";
import RoomPage from "./RoomPage";
import LeaderboardPage from "./LeaderboardPage";

const RoomWrongRoom = () => {

    const [loggedIn, setLoggedIn] = useState (false);
    const [loading, setLoading] = useState (true);
    const [participants, setParticipants] = useState([]);
    const [role, setRole] = useState('player');

    useEffect(() => {

        const verify = async () => {
            try {

                // Checking if the Player is in the room
                if(!localStorage.roomname||!localStorage.username){
                    setLoggedIn(false);
                    setLoading(false);
                    return;    
                }

                const res = await fetch('/api/rooms/leaderboard', {
                    method: 'POST',
                    headers: {
                    'Content-Type':'application/json',
                    'authorization':localStorage.token
                    },
                    body: JSON.stringify({roomname:localStorage.roomname,username:localStorage.username})
                })
                const result = await res.json();
                if(result.verified!=undefined) {
                setLoggedIn(result.verified);
                }
                if(result.role!=undefined) {
                    setRole(result.role);
                }
                if(result.isInPlay==undefined){
                    return;
                };
                console.log(result.isInPlay);
                if(result.leaderboard!=undefined){
                    setParticipants(result.leaderboard);
                }

            } catch (error) {
                console.error('Error:',error);
                setLoggedIn(false);        
            } finally {
                setLoading(false);
            }
        };

    verify();

  }, [])



    return (
        <div>
            {loading?"Loading":
                loggedIn?
                    (participants.length>0?
                        <LeaderboardPage 
                            participants={participants}    
                        />
                        :
                        <RoomPage
                            role={role}
                        />
                    )
                    :
                    <WrongRoom/>
            }
        </div>
    )
}

export default RoomWrongRoom