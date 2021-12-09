import { useEffect } from "react"

export default function Slug() {
    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/create')
            const data = await res.json()
            console.log(data)
        }
        fetchData()
    })
    // 
    return (
        <div>
            slug
        </div>
    )
}