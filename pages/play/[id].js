import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from 'next/router'

import styles from '../../styles/Play.module.css'
import CenterContainer from '../../components/CenterContainer'
import SpotifyEmbed from '../../components/SpotifyEmbed'
import StyledButton from '../../components/StyledButton'
import Modal from '../../components/Modal'

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

        const orderOff = []

        const points = correctSongs.reduce((scoreAccumulator, correctSongId, currentIndex) => {
            const whatTheyPicked = selectedTracks.findIndex(songId => songId === correctSongId)
            if (whatTheyPicked !== -1) {
                // store the number of positions away for reporting
                const distance = whatTheyPicked - currentIndex
                if (distance === 0) {
                  orderOff.push('0') // no offset
                } else if (distance > 0) {
                  orderOff.push('u') // up
                } else {
                  orderOff.push('d') // down
                }

                // 15 pts for getting a song in general
                let lineScore = 15
                // additional 5 possible points for order
                lineScore += 5 - Math.abs((whatTheyPicked + 1) - (currentIndex + 1))
                return scoreAccumulator + lineScore
            }
            // if song was not selected, score for that item is 0
            orderOff.push('x')
            return scoreAccumulator
        }, 0)

        orderOff.push(points)
        const pointHash = btoa(orderOff.join('-'))

        routeTo(`/share/${playerData.slug}/${pointHash}`)
    }

    const [modalOpen, setModalOpen] = useState(false)

    if (Object.keys(playerData).length === 0) return <></>
    return (
        <CenterContainer flash>
            <h1 className={styles.header}>Spotify WrapBattle</h1>
            <div className={styles.subtitle}>
                How well do you know <span className={styles.username}>{playerData.username}</span>?<br /><br />
                Pick the songs that you think are their <span className={styles.topf}>Top 5</span> from 2021!<br /><br />
                <i>But be careful, they added five fake songs to throw you off.</i><br /><br />

                <div className={styles.infocontainer}>
                  How to Score:
                  <div className={styles.info} onClick={() => setModalOpen(true)}>view</div>
                </div>

                {modalOpen && (
                  <Modal onClose={() => setModalOpen(false)}>
                    <div>
                      <br />How to Score:<br /><br />
                      <ul className={styles.list}>
                          <li>Choose songs in order from 1 to 5<br /></li>
                          <li>If you get them all in the correct order, you get a perfect score<br /></li>
                          <li>If you get all 5 in a non perfect order, you pass<br /></li>
                          <li>If you get em wrong, wellllll<br /></li>
                      </ul>
                    </div>
                  </Modal>
                )}
            </div>

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
