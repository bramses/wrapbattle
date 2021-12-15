import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from 'next/router'

import styles from '../../../styles/Share.module.css'
import CenterContainer from '../../../components/CenterContainer'
import SpotifyEmbed from '../../../components/SpotifyEmbed'
import StyledButton from '../../../components/StyledButton'
import Link from 'next/link'


const quotes = [
    {
        quote: "Ouchhhh, you might wanna pass (name) the aux cord more frequently",
        range: [0, 60],
    },
    {
        quote: "They say music brings us together. Unfortunately for you and (name) that does not seem to be the case.",
        range: [0, 40],
    },
    {
        quote: "You know nothing Jon Snow. Ok you may know some things, just not (name)'s music tastes.",
        range: [0, 40],
    },
    {
        quote: "Bing Bong! You got a lot wrong. You should inform (name) (and tell Ariana I miss her)",
        range: [0, 40],
    },
    {
        quote: "Well played. (name) should be impressed at your knowledge of them. Or creeped out, I guess.",
        range: [80, 100],
    },
    {
        quote: "You read (name) like a book. Ok, more like a novella.",
        range: [40, 80],
    },
    {
        quote: "You passed the course of (name). Idk how many credits it's worth, but for sure it's worth something (no refunds)",
        range: [60, 100],
    },
    {
        quote: "The spirit of (name) is within you.\n...do with that what you will.",
        range: [60, 80],
    },
    {
        quote: "I'm not a wrapper. But you and (name) will jam happily ever after.",
        range: [80, 100],
    }
]

export default function Share() {
    const [quote, setQuote] = useState(['', ''])
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
    const [offsets, setOffsets] = useState([])

    const onSubmit = async () => {
        routeTo(`/`);
    }

    useEffect(() => {
        const { correct } = router.query;
        if (correct) {
            const scoreMap = atob(correct)
            const answers = scoreMap.split('-')
            const points = answers.pop()

            setScore(points)
            // these offsets could be used to render up/down/spot-on if we wanted
            // but I think it will confuse the user since the order we are showing
            // them is the correct order, versus the order they chose
            setOffsets(answers)
        }

        if (Object.keys(playerData).length === 0) return
        if (Object.keys(playerData.songIDs).length === 0) return

        setTopFive(
            Object
                .values(playerData.songIDs)
                .slice(0, 5)
        )
    }, [playerData, router])

    useEffect(() => {
      const filteredQuotes = quotes.filter(quote => {
          return quote.range[0] <= score && quote.range[1] >= score
      })
      const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]
      setQuote(randomQuote.quote.split('(name)'))
    }, [score])

    return (
        <CenterContainer>
            <h1 className={styles.header}>
                <Link href="/" >
                🎶 SPOTIFY WRAPBATTLE ⚔️
                </Link>
            </h1>
            <h2 className={styles.quote}>
              {quote[0]}
              <span className={styles.name}>{playerData.username}</span>
              {quote[1]}
            </h2>
            <h1 className={styles.report}>
                You got {playerData.username}&apos;s song list <span className={styles.percent}>{score}%</span> correct!
            </h1>
            {topFive.map((songId, index) => (
                <div key={songId} className={styles.songcontainer}>
                    <SpotifyEmbed src={`https://open.spotify.com/embed/track/${songId}`} />
                    {offsets[index] !== 'x' ? (
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
