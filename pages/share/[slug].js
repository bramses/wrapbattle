import { useEffect, useState } from "react"
import { useRouter } from 'next/router'


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


    return (
        <div className="share-link">
            <div className="share-link__container">
                <div className="share-link__container__title">
                    <h2>Share this link with your friends</h2>
                </div>
                <p>{`https://www.wrapbattle.xyz/play/${url}`}</p>
                <button className="share-link__container__button" onClick={copyText}>Copy to Clipboard</button>
                <button>
                    <a className="twitter-share-button"
                    href={`https://twitter.com/intent/tweet?text=Can%20you%20guess%20what%20my%20top%20five%20songs%20were%20in%202021?%20https://www.wrapbattle.xyz/play/${url}`}>
                    Tweet</a>
                </button>
            </div>
        </div>
    )
}