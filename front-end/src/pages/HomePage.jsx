import React from 'react'
import { Box, Card, Link, styled, Typography } from '@mui/material'
import { Colours } from '../constants/colours'

const MainContainer = styled(Box) ({
  display: "flex", 
  flexGrow: 1, 
  justifyContent: "center", 
  alignItems: "center", 
  backgroundColor: "white"
})

const StyledContainer = styled(Card) ({
  padding: "40px 80px", 
  backgroundColor: "#F4F4FF"
})

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
    backgroundColor: Colours.primary,
    borderRadius: 7,
  }
})

/**
 * 
 * @returns the layout of the homepage with links to Login and Register pages
 */
const HomePage = () => {
  return (
    <MainContainer>
      <StyledContainer> 
        <ContentContainer>
          <Typography variant = "h4">Wave</Typography>
          <Typography variant = "subtitle1">Emotion-aware Email and Task Manager</Typography>

          <Link href = "/login" variant = "button">Login</Link>
          <Link href = "/register" variant = "button">Register</Link>
        </ContentContainer>
      </StyledContainer>

    </MainContainer>
  )
}

export default HomePage