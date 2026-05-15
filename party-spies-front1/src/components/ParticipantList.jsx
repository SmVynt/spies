import PropTypes from 'prop-types'
import { FaTimes, FaCheck } from 'react-icons/fa'

const ParticipantList = ({task}) => {

  return (
    <div className=''>
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

ParticipantList.propTypes ={
  task: PropTypes.any.isRequired
}

export default ParticipantList