import PropTypes from 'prop-types';
import ParticipantList from './ParticipantList';

const Participant = ({participant}) => {

    const tasksSucceed = participant.completedTasks.filter(a => a.succeed===true);
    const tasksFailed = participant.completedTasks.filter(a => a.succeed===false);

    return (
        <div className="mx-auto md:flex md:flex-col bg-spyDarkPink w-96 h-auto p-4 space-y-4 md:m-0">
            <h1 className='text-3xl text-white'>
                {participant.username}
                {" : "}
                <span className='text-spyYellow font-bold'>
                {participant.points}
                </span>
            </h1>
            <div className="space-y-4">
                {tasksSucceed.map((task, index) => (
                    <ParticipantList 
                        key = {index}
                        task = {task}
                    />
                ))}
            </div>
            <div className="space-y-4">
                {tasksFailed.map((task, index) => (
                    <ParticipantList 
                        key = {index}
                        task = {task}
                    />
                ))}
            </div>
        </div>
    )
}

Participant.propTypes ={
    participant: PropTypes.any.isRequired
}

export default Participant