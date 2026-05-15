import { useTranslation } from "react-i18next";
import Menu_button from "../components/Menu_button";
import Participant from "../components/Participant";
import PropTypes from 'prop-types';

const LeaderboardPage = ({participants}) => {
    
    const {t} = useTranslation();

    console.log(participants);
    ////
    //// LEADERBOARD PAGE
    return (
        <div className="space-y-8">
            {participants.length > 0? (
                <div className="space-y-8">
                    <div>      
                        <h1 className="text-center text-2xl text-white font-bold md:text-left">
                            {t("room congrats")}
                        </h1>
                        <h1 className="text-center text-6xl text-spyYellow font-bold md:text-left">
                                {participants[0].username}
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {participants.map((participant, index) => (
                            <Participant 
                                key = {index}
                                participant = {participant}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div> 
                    <div className="text-center text-white text-2xl font-bold md:text-left">
                        {t("error")}
                    </div>
                </div>
            )}
            <Menu_button title={t("back")} img_id={3} link="/"/>
        </div>
    )
}

LeaderboardPage.propTypes ={
    participants: PropTypes.array.isRequired
}

export default LeaderboardPage