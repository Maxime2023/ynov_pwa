import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from "react";
import './matches.css'

const Matches = () => {

    const [matches, setMatches] = useState([])

    useEffect(() => {
        axios.get(`https://7uyqywoy02.execute-api.eu-central-1.amazonaws.com/Prod/matches`)
        .then(res => {
            setMatches(res.data)
            console.log(res.data)
        })
      }, []);

    return (
        <div>
            {
                matches.map(match =>
                    <div className='matchWrapper'>
                        <div className='redTeam'>
                            <div>
                                {match.player_one_red}
                            </div>
                            <div>
                            {match.player_two_red}
                            </div>
                        </div>
                        <div className='blueTeam'>
                            <div>
                            {match.player_one_blue}
                            </div>
                            {match.player_two_blue}
                            <div>
                            </div>
                        </div>
                    </div>
                    )
            }
        </div>
    )
}

export default Matches
