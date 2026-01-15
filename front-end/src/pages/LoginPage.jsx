import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'
import Loader from '../customComponents/Loader'

/**
 * 
 * @returns contents of the Login page: forms and submit button
 */
const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()

  /**
   * 
   * Handle log in with values passed in input fields. If error is returned display the error message.
   */
  const handleSubmit = async (event) => {
    event.preventDefault() // prevent automatic refreshing
    setMessage("") // clear any previous message
    
    // Clear the fields
    setEmail("")
    setPassword("")

    try {
      setLoading(true)
  
      const {data, error} = await login(email, password)
      if (data) {
        navigate("/emails")
        // navigate("/")
        // console.log(data)
      }
      if (error) setMessage(error)
      
      setLoading(false)
      
    } catch (error) {
      // console.log(error.message)
      setMessage(error.message)
    }

  }

  // If loading display the loader otherwise the content
  return (loading 
    ? (<Loader />)
    : (
      <div>
        <h2>Login</h2>
        <br></br>

        <Link to = "/home" >Home</Link>
        <br></br>

        {/* If there is a message, display it */}
        {message && <span>{message}</span>}

        <form
          onSubmit = {handleSubmit}
        >
          <input 
            type = 'email' 
            placeholder = 'Email' 
            onChange = {(e) => setEmail(e.target.value)}
            value = {email}
            required
          />
          
          <input 
            type = 'password' 
            placeholder = 'Password' 
            onChange = {(e) => setPassword(e.target.value)}
            value = {password}
            required
          />

          <button type = 'submit' data-testid = "login-btn" >
            Login
          </button>
        </form>

        <span>Don't have an account?</span>
        <Link to = "/register">Register</Link>
      </div>
    )
  )
}

export default LoginPage