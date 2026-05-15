import JoinRoom from "./JoinRoomPage";
import Invite from "./InvitePage";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const JoinInvite = () => {

    const [loggedIn, setLoggedIn] = useState (false);
    const [loading, setLoading] = useState (true);
    const {id} = useParams();

    useEffect(() => {

        const verify = async () => {
            try {
                console.log("verifying");
                if(!localStorage.roomname||!localStorage.username){
                    console.log("no data to verify");
                    setLoggedIn(false);
                    setLoading(false);
                    return;    
                }
                //const lowerName = localStorage.roomname.toLowerCase();
                if(id.toLowerCase()!=localStorage.roomname.toLowerCase()){
                    console.log("not the same");
                    setLoggedIn(false);
                    setLoading(false);
                    return;    
                }
                const res = await fetch('/api/rooms/verify', {
                    method: 'POST',
                    headers: {
                    'Content-Type':'application/json',
                    'authorization':localStorage.token
                    },
                    body: JSON.stringify({roomname:localStorage.roomname,username:localStorage.username})
                })
                const result = await res.json();
                console.log(result);
                if(result.verified!=undefined) {
                setLoggedIn(result.verified);
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
            {loading?
                <div className="text-white">
                    Loading
                </div>    
                :
                loggedIn?
                    <Invite/>:
                    <JoinRoom/>
            }
        </div>
    )
}

export default JoinInvite