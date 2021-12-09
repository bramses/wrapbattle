import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from 'next/router'

import styles from '../../../styles/Share.module.css'
import CenterContainer from '../../../components/CenterContainer'
import SpotifyEmbed from '../../../components/SpotifyEmbed'
import StyledButton from '../../../components/StyledButton'

export default function Share() {

    const router = useRouter()
    const [playerData, setplayerData] = useState({})

    const routeTo = (href) => {
        router.push(href)
    }


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

    const onSubmit = async () => {
        routeTo(`/create`);
      }

    useEffect(() => {
        const { correct } = router.query;
        if (correct) {
            const answers = correct.split('')
            const numRight = answers.reduce((accum, curr) => (curr === '1' ? accum + 1 : accum), 0)
            setCorrectSongs(answers.map(answer => answer === '1'))
            setScore(Math.min(numRight * 20, 100))
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
        <CenterContainer>
            <h1 className={styles.report}>
                You got <span className={styles.percent}>{score}%</span> of {playerData.username}&apos;s songs!
            </h1>
            {topFive.map((songId, index) => (
                <div key={songId} className={styles.songcontainer}>
                    <SpotifyEmbed src={`https://open.spotify.com/embed/track/${songId}`} />
                    {correctSongs[index] ? (
                        <div className={styles.checkmark}>✓</div>
                    ) : (
                        <div className={`${styles.checkmark} ${styles.wrong}`}>✕</div>
                    )}
                </div>
            ))}
            <StyledButton style={{ marginTop: '16px' }} onClick={onSubmit}>Make Your Own!</StyledButton>
        </CenterContainer>
    )
}
