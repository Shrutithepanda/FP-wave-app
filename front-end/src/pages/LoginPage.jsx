import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'
import Loader from '../customComponents/Loader'
import Form from 'react-bootstrap/Form'
// import Button from 'react-bootstrap/Button'
import { useEffect } from 'react'
import { Box, styled, TextField, Link, Card, Typography, Button } from '@mui/material'
import { House } from 'react-bootstrap-icons'

const StyledCard = styled(Card) ({
  padding: "20px 60px",   
  backgroundColor: "#F4F4FF",
  textAlign: "center", 
  "& > button": {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#42458A"
  }
})

const FormContainer = styled(Box)({
  marginBottom: 10,
  "& > div": {
    marginTop: 10,
    // marginBottom: 10
  }
})

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
  const [disabled, setDisabled] = useState(false)

  const { login } = useAuth()

  /**
   * 
   * Handle log in with values passed in input fields. If error is returned display the error message.
   */
  const handleSubmit = async (event) => {
    event.preventDefault() // prevent automatic refreshing
    setMessage("") // clear any previous message
    
    if (email === "", password === ""){
      setMessage("All fields must be filled before proceeding.")
    }
    else {
      setLoading(true)
      try {

        // const {data, error} = await login(email, password)
        const result = await login(email, password)

        if (!result.success) setMessage(result.error)
        if (result.success) {
          navigate("/emails")
          // navigate("/")
          // console.log(data)
        }
          
      } catch (error) {
        // console.log(error.message)
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
    ? (
      <>
        <Loader />
      </>
    )
    : (
      <Box style = {{display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white"}}>
        <StyledCard>
              <Typography variant = "h4" style = {{marginBottom: 10}}>Login</Typography>
              <Link href = "/" style = {{alignSelf: "flex-start"}}>Home</Link>

            {/* If there is a message, display it */}
            {message && <Typography color = "error">{message}</Typography>}

            <FormContainer
              // onSubmit = {handleSubmit}
              // className = "text-start"
            >
              <TextField 
                required
                // id = "outlined-basic" 
                label = "Emails address" 
                variant = "outlined" 
                size = "small"
                fullWidth
                // color = "secondary"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
              />

              <TextField 
                required
                // id = "outlined-basic" 
                label = "Password" 
                variant = "outlined" 
                size = "small"
                fullWidth
                // color = "secondary"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
              />
            </FormContainer>
            
            <Button 
              onClick = {handleSubmit} 
              variant = "contained" 
              disabled = {loading} 
              data-testid = "login-btn"
            >
              Login
            </Button>
          
            <Typography>
              Don't have an account yet? 
              <Link href = "/register">Register</Link>
            </Typography>
          {/* </Card.Body> */}
        </StyledCard>
      </Box>
    )
  )
}

export default LoginPage