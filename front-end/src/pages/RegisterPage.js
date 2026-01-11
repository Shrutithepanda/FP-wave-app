import React, { useState } from 'react'
import supabase from '../supabase/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'
import Loader from '../customComponents/Loader'

/**
 * 
 * @returns contents of the Register page: forms and submit button
 */
const RegisterPage = () => {
  // const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState("")
  
  const { register } = useAuth()

  /**
   * 
   * Handle user registration with values passed in input fields. If error is returned display the error message.
   */
  const handleSubmit = async (event) => {
    event.preventDefault() // prevent automatic refreshing
    setMessage("") // clear any previous message

    // Clear the fields
    setEmail("")
    setPassword("")

    try {
      setLoading(true)
  
      await register(email, password)

      
    } catch (error) {
      // console.log(error.message)
      setMessage(error.message)
    }
    setLoading(false)
    
  }

  // If loading display the loader otherwise the content
  return (loading 
    ?
      (
        // Put in some container
        <>
          <Loader />
        </>
      )
    : (
    <div>
      <h2>Register</h2>
      <br></br>
      
      <Link to = "/Home" >Home</Link>
      <br></br>

      {/* If there is a message, display it */}
      {message && <span>{message}</span>}

      <form
        onSubmit = {handleSubmit}
      >
        <input 
          type = 'email' 
          placeholder = 'Email' 
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
          required
        />
        
        <input 
          type = 'password' 
          placeholder = 'Password' 
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
          required
        />

        <button type = 'submit' >
          Register
        </button>

        {/* <button type = 'button' onClick = {handleDeleteUser} >
          Delete user
        </button> */}
      </form>

      <span>Already have an account?</span>
      <Link to = "/login">Login</Link>
    </div>
    )
  )
}

export default RegisterPage