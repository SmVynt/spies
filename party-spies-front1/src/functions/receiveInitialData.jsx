
const receiveInitialData = (data) => {  
    localStorage.setItem('token', data.token);
    localStorage.setItem('roomname', data.roomname);
    localStorage.setItem('username', data.username);
    localStorage.setItem('mTPU', data.mTPU);
    localStorage.setItem('tPU', data.tPU);
    localStorage.setItem('completedTasks', '[]');
    localStorage.setItem('gameEndsAt',data.gameEndsAt);


    let currentTasks = data.selectedTasks.slice(0,(-data.mTPU+data.tPU));
    localStorage.setItem('currentTasks',JSON.stringify(currentTasks));

    
    localStorage.setItem('tasks', JSON.stringify(data.selectedTasks.slice(data.tPU)));
}

export default receiveInitialData;