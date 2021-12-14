import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Head from 'next/head'

import styles from '../../styles/ShareLink.module.css'
import buttonStyles from '../../styles/StyledButton.module.css'
import CenterContainer from '../../components/CenterContainer'
import StyledButton from '../../components/StyledButton'

export default function ShareLink() {
    const router = useRouter()
    const [url, setURL] = useState('')

    useEffect(() => {
        async function fetchData() {
            const { slug } = router.query;
            if (slug) {
                console.log(slug)
                setURL(slug)
            }
        }
        fetchData()
    }, [router])


    const copyText = function () {
        navigator.clipboard.writeText(`https://www.wrapbattle.xyz/play/${url}`)
            .then(function () {
                alert("Copied URL to clipboard");
            }).catch(function (err) {
                alert('Could not copy text: ', err);
            });
    }

    const openTweet = () => {
      window.open(
        `https://twitter.com/intent/tweet?text=Can%20you%20guess%20what%20my%20top%20five%20songs%20were%20in%202021?%20https://www.wrapbattle.xyz/play/${url}`,
        '_blank',
        'noreferrer'
      )
    }

    return (
        <CenterContainer>
            <Head>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            </Head>
            <h2 className={styles.header}>Share this link with your friends</h2>
            <p className={styles.link}>{`https://www.wrapbattle.xyz/play/${url}`}</p>
            <div className={styles.buttonContainer}>
                <StyledButton onClick={copyText}>Copy to Clipboard</StyledButton>
                <button
                  className={`${buttonStyles.button} ${styles.tweet}`}
                  onClick={openTweet}
                >
                    <i className="fa fa-twitter" />
                    <span
                      className={styles.tweettext}
                    >
                        Tweet
                    </span>
                </button>
            </div>
        </CenterContainer>
    )
}
