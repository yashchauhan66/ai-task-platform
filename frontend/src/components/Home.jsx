import React from 'react'
import {Link} from "react-router-dom"

function Home() {
  return (
    <>
     <div>Home</div>
    <Link to="/login">login</Link>
    <Link to="/signup">signup</Link>
    <Link to="/dashboard">dashboard</Link>
    </>
   
  )
}

export default Home
