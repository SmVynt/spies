import PropTypes from 'prop-types';
import { FaCheck } from 'react-icons/fa';
import { FaTimes } from "react-icons/fa";

const TaskCompleted = ({task}) => {

    return (
        <div className="mx-auto md:flex md:flex-col bg-spyDarkPink w-96 h-auto p-4 md:m-0">
            <div className="flex flex-row h-full gap-4">
                <div className='w-1/4'>
                    <div className="h-full flex items-center justify-center">
                        {task.succeed==false? 
                            <FaTimes className="text-spyPink scale-150"/>
                            :
                            <FaCheck className="text-spyYellow scale-150"/>}    
                    </div>
                </div>
                
                <div className=' text-white w-3/4'>
                    {task.description}
                </div>

            </div>
        </div>
    )
}

TaskCompleted.propTypes ={
    task: PropTypes.any.isRequired
}

export default TaskCompleted