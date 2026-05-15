const verify = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/rooms/verify', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'authorization':localStorage.token
        },
        body: JSON.stringify({roomname:localStorage.roomname,username:localStorage.username})
    })
    const result = await res.json();
    if(result.verified) {
      return true;
    }
    return false;
  } catch (error) {
      console.error('Error:',error);
      return false;        
  }
}


export default verify