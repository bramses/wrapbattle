import { useEffect } from "react"
import axios from 'axios';

export default function Slug() {
    useEffect(() => {
        async function fetchData() {
            const res = await axios.post('/api/read', { slug: '33-tidy-dragonflies-obnoxiously-engaged'});
            const data = await res.data
            console.log(data)
        }
        fetchData()
    })
    // 
    return (
        <div>
            readslug
        </div>
    )
}