import React from 'react'
// import { Link } from 'react-router-dom'
import './HomePage.css'
// import Container from 'react-bootstrap/Container'
// import Card from 'react-bootstrap/Card'
// import Button from 'react-bootstrap/Button'
import { Box, Card, Link, styled, Typography } from '@mui/material'

const ContentContainer = styled(Box) ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& > h6": {
    marginBottom: 15
  },
  "& > a": {
    width: 150,
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 7,
    textAlign: "center",
    textTransform: "none",
    textDecoration: "none",
    color: "#fff",
    backgroundColor: "#42458A",
    borderRadius: 7,
  }
})

/**
 * 
 * @returns the layout of the homepage with links to Login and Register pages
 */
function HomePage() {
  return (
    <Box style = {{display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center"}}>
      <Card style = {{padding: "40px 80px", backgroundColor: "#F4F4FF"}}> 
        <ContentContainer>
          <Typography variant = "h4">Wave</Typography>
          <Typography variant = "subtitle1">Emotion-aware Email and Task Manager</Typography>

          <Link href = "/login" variant = "button">Login</Link>
          <Link href = "/register" variant = "button">Register</Link>
        </ContentContainer>
      </Card>

    </Box>
    // <Container className = "d-flex justify-content-center Main-content-" > 
    //   <Card className = "align-self-center shadow">
    //     <Card.Body className = "m-5 Headings-" >
    //       <h1>Wave</h1>
    //       <p>Emotion-aware Email and Task Manager</p>

    //       <div className="d-grid gap-2 Links-container-" >
    //         <Button href = "/login" variant = "primary" className = "btn btn-primary Links-" >Login</Button>
    //         <Button href = "/register" variant = "primary" className = "btn btn-primary Links-" >Register</Button>
    //       </div>
    //     </Card.Body>
    //   </Card>
    // </Container>
  )
}

export default HomePage