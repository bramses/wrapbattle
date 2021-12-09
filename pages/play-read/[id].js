import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from 'next/router'


export default function Slug() {
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
    // 
    return (
        <div>
            readslug: {JSON.stringify(playerData, null, 4)}
        </div>
    )
}