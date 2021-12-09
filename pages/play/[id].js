import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from 'next/router'

import styles from '../../styles/Play.module.css'
import CenterContainer from '../../components/centercontainer'
import SpotifyEmbed from '../../components/SpotifyEmbed'

export default function Play() {
    const router = useRouter()
    const [playerData, setplayerData] = useState({})
    useEffect(() => {
        async function fetchData() {
            const { id } = router.query;
            if (id) {
                const res = await axios.post('/api/read', { slug: id });
                const data = await res.data
                setplayerData(data)
                console.log(data)
            }

        }
        fetchData()
    }, [router])

    const [randomTrackList, setRandomTrackList] = useState([])
    useEffect(() => {
        if (Object.keys(playerData).length === 0) return
        if (Object.keys(playerData.songIDs).length === 0) return
        setRandomTrackList(
            Object
                .values(playerData.songIDs)
                .map(value => [Math.random(), value])
                .sort((a, b) => a[0] - b[0])
                .map(valueSet => valueSet[1])
        )
    }, [playerData])

    return (
        <CenterContainer flash>
            <h1 className={styles.header}>Spotify WrapBattle</h1>
            <p className={styles.subtitle}>
                How well do you know HostName?<br />
                Pick the songs that you think are their Top 5 from 2021!
            </p>

            {randomTrackList.map(songId => (
                <div key={songId} className={styles.songcontainer}>
                    <SpotifyEmbed src={`https://open.spotify.com/embed/track/${songId}`} />
                    <div className={styles.question}>?</div>
                </div>
            ))}
        </CenterContainer>
    );
}
