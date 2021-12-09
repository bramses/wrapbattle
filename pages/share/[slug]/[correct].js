import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from 'next/router'

import styles from '../../../styles/Play.module.css'
import CenterContainer from '../../../components/centercontainer'
import SpotifyEmbed from '../../../components/SpotifyEmbed'

export default function Share() {

    const router = useRouter()
    const [playerData, setplayerData] = useState({})

    useEffect(() => {        
        async function fetchData() {
            const { slug } = router.query;
            if (slug) {
                const res = await axios.post('/api/read', { slug: slug });
                const data = await res.data
                setplayerData(data)
                console.log(data)
            }
            
        }
        fetchData()
    }, [router])

    const [topFive, setTopFive] = useState([])
    const [score, setScore] = useState(0)
    const [correctSongs, setCorrectSongs] = useState([])
    useEffect(() => {
        const { correct } = router.query;
        if (correct) {
            console.log(correct.split(',').length / 5)
            setScore(Math.min((correct.split(',').length / 5) * 100, 100))
        }
        if (Object.keys(playerData).length === 0) return
        if (Object.keys(playerData.songIDs).length === 0) return
        setTopFive(
            Object
                .values(playerData.songIDs)
                .slice(0, 5)
        )
    }, [playerData, score, router])

    return (
        <CenterContainer flash>
            <h1>You Got {score}% of {playerData.username}</h1>
            {topFive.map(songId => (
                <div key={songId} >
                    <SpotifyEmbed src={`https://open.spotify.com/embed/track/${songId}`} />
                </div>
            ))}
            <button>Make Your Own!</button>
        </CenterContainer>
    )
}