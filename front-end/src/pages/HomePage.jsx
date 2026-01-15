import React from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

/**
 * 
 * @returns the layout of the homepage with links to Login and Register pages
 */
function HomePage() {
  return (
    <div className = "Main-content" > 
      <div className = "Headings" >
        <h1>Wave</h1>
        <p>Emotion-aware Email and Task Manager</p>
      </div>

      <div className = "Links-container" >
        <Link to = "/register" className = "Links" >Register</Link>
        <Link to = "/login" className = "Links" >Login</Link>
      </div>
    </div>
  )
}

export default HomePage