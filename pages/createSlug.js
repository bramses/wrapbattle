import { useEffect, useState } from "react"
import axios from 'axios';

export default function Slug() {

    const [URL, setURL] = useState('')

    useEffect(() => {
        async function fetchData() {

            const songIDs = {
                "1": "3USxtqRwSYz57Ewm6wWRMp",
                "2": "5J6rTmMjF9DVIAF8G3M9n4",
                "3": "4ZtFanR9U6ndgddUvNcjcG",
                "4": "3Vi5XqYrmQgOYBajMWSvCi",
                "5": "4iN16F8JtVxG2UTzp3avGl",
                "6": "50nfwKoDiSYg8zOCREWAm5",
                "7": "3Kkjo3cT83cw09VJyrLNwX",
                "8": "3QPBocWfIcOCdFFvmqn60F",
                "9": "5GzpstdtupjJcu0JR5j3v6",
                "10": "00Blm7zeNqgYLPtW6zg8cj"
            }

            const username = 'my-name-is-jeff'
            const res = await axios.post('/api/create', { songIDs, username })
            const data = await res.data
            setURL('wrapbattle.xyz/play/' + data.slug)
        }
        fetchData()
    }, [])
    // 
    return (
        <div>
            created object : {URL}
        </div>
    )
}