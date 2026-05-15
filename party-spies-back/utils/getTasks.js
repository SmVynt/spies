
const getTasks = ({tasks, count}) => {
  const tasksCopy = [...tasks];
  const selectedTasks = [];

  for (let i = 0; i < count && tasksCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * tasksCopy.length);
    
    selectedTasks.push(tasksCopy[randomIndex]);

    tasksCopy.splice(randomIndex, 1);
    
    console.log(i);
    }
    
  return selectedTasks;
}

module.exports = {getTasks};