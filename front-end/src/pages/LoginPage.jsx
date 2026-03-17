import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'
import Loader from '../customComponents/Loader'
import { Box, styled, TextField, Link, Card, Typography, Button } from '@mui/material'
import { Colours } from '../constants/colours'

// Styled MUI components
const StyledCard = styled(Card) ({
  padding: "20px 60px",   
  backgroundColor: "#F4F4FF",
  textAlign: "center", 
  "& > button": {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: Colours.primary
  }
})

const FormContainer = styled(Box)({
  marginBottom: 10,
  "& > div": {
    marginTop: 10,
  }
})

/**
 * 
 * @returns contents of the Login page
 */
const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Login function from useAuth hook
  const { login } = useAuth()

  /**
   * Handle log in with values passed in input fields. If error is returned display the error message.
   * @param {*} event 
   */
  const handleSubmit = async (event) => {
    event.preventDefault() // prevent automatic refreshing
    setMessage("") // clear any previous message
    
    if (email === "", password === ""){
      // Display a message if fields are empty and submit is pressed
      setMessage("All fields must be filled before proceeding.")
    }
    else {
      setLoading(true)
      try {
        // Wait for the login function to log the user in
        const result = await login(email, password)

        // If success response is not returned display the error message
        if (!result.success) setMessage(result.error)

        // If success response is returned, navigate to the emails page
        if (result.success) navigate("/emails")
          
      } catch (error) {
        setMessage(error.message)
      } finally {
        setLoading(false)
      }

    }
    // Clear the fields
    setEmail("")
    setPassword("")

  }

  // If loading display the loader otherwise the content
  return (
    loading 
    ? (
      <Box>
        <Loader />
      </Box>
    )
    : (
      <Box sx = {{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        <main>
          <StyledCard>
            {/* Heading and link to Home page */}
            <Typography variant = "h1" sx = {{ fontSize: 35, fontWeight: 500 }}>Login</Typography>
            <Link href = "/" sx = {{ alignSelf: "flex-start" }}>Home</Link>

            {/* If there is a message, display it */}
            {message && <Typography color = "error" sx = {{ fontWeight: 600 }}>{message}</Typography>}

            {/* Email and password fields */}
            <FormContainer>
              <TextField 
                required
                label = "Emails address" 
                aria-label = "email address"
                variant = "outlined" 
                size = "small"
                fullWidth
                value = { email }
                onChange = { (e) => setEmail(e.target.value) }
              />

              <TextField 
                required
                label = "Password" 
                aria-label = "password"
                type = "password"
                variant = "outlined" 
                size = "small"
                fullWidth
                value = { password }
                onChange = { (e) => setPassword(e.target.value) }
              />
            </FormContainer>
            
            {/* Submit button */}
            <Button 
              onClick = { handleSubmit } 
              variant = "contained" 
              disabled = { loading } 
              data-testid = "login-btn"
            >
              Login
            </Button>
          
            {/* Link to the Resigter page */}
            <Typography>
              Don't have an account yet? &nbsp;
              <Link href = "/register">Register</Link>
            </Typography>

          </StyledCard>
        </main>
      </Box>
    )
  )
}

export default LoginPage