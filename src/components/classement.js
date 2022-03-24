import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from "react";
import './matches.css'

const Classement = () => {
    const [players, setplayers] = useState([])

    useEffect(() => {
        axios.get(`https://7uyqywoy02.execute-api.eu-central-1.amazonaws.com/Prod/players`)
        .then(res => {
 
            let tmp = [];
            for (let i = res.data.length - 1; i >= 0; i--) {
                tmp.push(res.data[i])
            }
            setplayers(tmp)
            console.log(tmp)
        })
      }, []);

    return (
        <div>
            {
                players.map(player =>
                    <div className='playerWrapper'>
                        <div style={{width: "70%"}}>
                        Joueur : {player.players}
                        </div>
                        <div style={{width: "30%"}}>
                        Points : {player.points}
                        </div>
                  
                    </div>
                    )
            }
        </div>
    )
}

export default Classement
