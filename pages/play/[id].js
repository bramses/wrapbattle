import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from 'next/router'

import styles from '../../styles/Play.module.css'
import CenterContainer from '../../components/CenterContainer'
import SpotifyEmbed from '../../components/SpotifyEmbed'
import StyledButton from '../../components/StyledButton'

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

    const [selectedTracks, setSelectedTracks] = useState([])

    const handleAdd = (songId) => {
        if (selectedTracks.length >= 5) return
        setSelectedTracks([...selectedTracks, songId])
    }

    const handleRemove = (songId) => {
        setSelectedTracks(selectedTracks.filter(aSongId => aSongId !== songId))
    }

    const handleClear = () => {
        setSelectedTracks([])
    }

    const routeTo = (href) => {
        router.push(href)
    }

    const handleSubmit = () => {
        const correctSongs = Object
        .values(playerData.songIDs)
        .slice(0, 5)

        let points = []
        correctSongs.forEach(songId => {
            if (selectedTracks.includes(songId)) {
                points.push(1)
            } else {
                points.push(0)
            }
        })
        
        routeTo(`/share/${playerData.slug}/${points.join('')}`)
    }

    if (Object.keys(playerData).length === 0) return <></>
    return (
        <CenterContainer flash>
            <h1 className={styles.header}>Spotify WrapBattle</h1>
            <p className={styles.subtitle}>
                How well do you know <span className={styles.username}>{playerData.username}</span>?<br />
                Pick the songs that you think are their Top 5 from 2021!
            </p>

            <div className={styles.actions}>
                <StyledButton onClick={handleClear}>✕ CLEAR</StyledButton>
                <StyledButton onClick={handleSubmit}>SUBMIT</StyledButton>
            </div>

            {randomTrackList.map(songId => (
                <div key={songId} className={styles.songcontainer}>
                    <SpotifyEmbed src={`https://open.spotify.com/embed/track/${songId}`} />

                    {selectedTracks.includes(songId) ? (
                        <div className={`${styles.question} ${styles.checkmark}`} onClick={() => handleRemove(songId)}>
                            {selectedTracks.findIndex(el => el === songId) + 1}
                        </div>
                    ) : (
                        <div className={styles.question} onClick={() => handleAdd(songId)}>
                            ?
                        </div>
                    )}
                </div>
            ))}
        </CenterContainer>
    );
}
