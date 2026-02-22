import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'
import Loader from '../customComponents/Loader'
import { Box, styled, TextField, Link, Card, Typography, Button } from '@mui/material'
import { Colours } from '../constants/colours'

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
 * @returns contents of the Register page
 */
const RegisterPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState("")
  
  const { register } = useAuth()

  /**
   * Handle user registration with values passed in input fields. If error is returned display the error message.
   * @param {*} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault() // prevent automatic refreshing
    setMessage("") // clear any previous message

    if (email === "", password === "") {
      // Show message if fields are empty
      setMessage("All fields must be filled before proceeding.")
    }
    else {
      setLoading(true)

      try {
        // Wait for the register function to register the user
        const result = await register(email, password)
        
        // If success response is not returned show the erorr message
        if (!result.success) setMessage(result.error)
        
        // If success response is returned navigate to the Emails page
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
  return (loading 
    ?
      (
        <Box>
          <Loader />
        </Box>
      )
    : (
      <Box style = {{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        <StyledCard>
          {/* Heading and link to the Home page */}
          <Typography variant = "h4" style = {{ marginBottom: 10 }}>Register</Typography>
          <Link href = "/">Home</Link>
          

          {/* If there is a message, display it */}
          {message && <Typography color = "error">{message}</Typography>}

          {/* Email and password fields */}
          <FormContainer>
            <TextField 
              required
              label = "Emails address" 
              variant = "outlined" 
              size = "small"
              fullWidth
              value = { email }
              onChange = { (e) => setEmail(e.target.value) }
            />

            <TextField 
              required
              label = "Password" 
              type = "password"
              variant = "outlined" 
              size = "small"
              fullWidth
              value = {password}
              onChange = { (e) => setPassword(e.target.value) }
            />
          </FormContainer>

          {/* Submit button */}
          <Button 
            onClick = { handleSubmit } 
            variant = "contained" 
            disabled = { loading } 
            data-testid = "register-btn"
          >
            Register
          </Button>

          {/* Link to the Login page */}
          <Typography>
            Already have an account? 
            <Link href = "/login">Login</Link>
          </Typography>

        </StyledCard>
      </Box>
    )
  )
}

export default RegisterPage