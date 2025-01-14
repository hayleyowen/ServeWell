"use client"
import { Catamaran } from "next/font/google"
import { useEffect , useState } from "react"

export default function Home() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await fetch('/api/posts')
          const response = await data.json()
          setPosts(response.posts)
          console.log(response)
        } catch (error) {
          console.error(error)
        }
      }

      fetchData()
    }, [])
    return (
    <section className='py-24'>
      <div className='container'>
        <h1 className='text-3xl font-bold'>Next TS Starter</h1>
        {posts.map(post => (
          <div>{post.ChurchName}</div>
        ))}
      </div>  
    </section>
  );
};