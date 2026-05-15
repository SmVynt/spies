import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';

const Task = ({task, callDone, callFail}) => {

    const {t} = useTranslation();

    const onDone = () =>{

        callDone(task);
    }

    const onFail = () =>{

        callFail(task);
    }

    return (
        <>
            <div className="mx-auto md:flex md:flex-col bg-white w-96 h-auto md:m-0">
                <div className="m-4">
                    {task.description}
                </div>
                <div className="flex flex-row mt-auto h-12 w-full font-bold">
                    
                    <button
                            className='bg-spyDarkPink text-white w-1/2 h-full'
                            onClick={onFail}> 
                                {t("task failed")}
                    </button>
                    <button
                            className='bg-spyYellow text-black w-1/2 h-full'
                            onClick={onDone}> 
                                {t("task done")}
                    </button>

                </div>
            </div>
        </> 
    )
}

Task.propTypes ={
    task: PropTypes.any.isRequired,
    callDone: PropTypes.func.isRequired,
    callFail: PropTypes.func.isRequired
}

export default Task