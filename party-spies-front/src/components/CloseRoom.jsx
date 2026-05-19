import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const CloseRoom = ({isOpen, onClose}) => {

    const {t} = useTranslation();
  
    if(!isOpen) return null;
    
    const requestRoomClose = async () => {
        const res = await fetch('/api/rooms/close', {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
              'authorization':localStorage.token
            },
            body: JSON.stringify({roomname:localStorage.roomname,username:localStorage.username})
        });
        const result = await res.json();
        if(result.success!=undefined){
            window.location.reload();
        }

    };

  return (
    <div className='fixed -inset-32 bg-black bg-opacity-70 flex items-center justify center'>
        <div className="bg-spyAubergine w-96 relative m-auto">
            {/* Ваши UI элементы внутри модального окна */}
            <div className="space-y-4 m-4">
                <h2 className="text-xl font-bold text-spyYellow">{t("room finish")}</h2>
            
            <div className="text-white">{t("room sure")}</div>
            </div>
            {/* Пример кнопки внутри диалога */}
            
            <div className="flex flex-row mt-auto h-12 w-full font-bold">
                    
                    <button
                            className='bg-spyDarkPink text-white w-1/2 h-full'
                            onClick={onClose}> 
                            {t("room cancel button")}
                    </button>
                    <button
                            className='bg-spyYellow text-black w-1/2 h-full'
                            onClick={requestRoomClose}> 
                            {t("room finish button")}
                    </button>

            </div>
        </div>
    </div>
  )
}

CloseRoom.propTypes ={
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

export default CloseRoom