import React, { useEffect, useState } from 'react'
import './AppHeader.css'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import PropTypes from 'prop-types'
import { Search, List, Envelope, ListNested, Camera, ArrowClockwise, BorderBottom, Border } from 'react-bootstrap-icons'
import { AppBar, Toolbar, styled, InputBase, Box, Typography, IconButton, Menu, MenuItem, Link, ToggleButton, ToggleButtonGroup, Tabs, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useEmotion } from '../hooks/EmotionProvider'
import { NavLink, Router, useLocation, useNavigate } from 'react-router-dom'
import { Colours } from '../constants/colours'

const StyledAppBar = styled(AppBar) ({
    background: "#F0F0F0",
    boxShadow: 'none',
    width: "100vw",
    height: 70,
})

const SearchWrapper = styled(Box) ({
    backgroundColor: "#FFF",
    borderRadius: 20,
    height: 48, 
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    '& > div': {
        width: "100%",
        padding: "0 5px"
    }
})

const TabsWrapper = styled(Box) ({
    width: "15vw",
    height: 50,
    display: "flex",
    alignItems: "center",
    marginRight: 20,
    '& > a': {
        width: "50%",
        height: "100%",
        textDecoration: "none",
        color: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&.active": {
            // background: "#DDDDEE",
            borderBottom: `2px solid ${Colours.secondary}`,
            paddingTop: 0
            // boxShadow: "0 0 5px 3px #BFC0F7 inset",
        }
    }
})

const StyledCameraContainer = styled(Box) ({
    display: "flex", 
    alignItems: "center", 
    borderRadius: 20, 
    padding: 8, 
    marginRight: 10,
})

/**
 * 
 * @returns a NavBar component with contents: Sidebar toggle button, camera icon, search bar, Emails/Tasks buttons
*/
const AppHeader = ({ toggleSidebar }) => {  
    const navigate = useNavigate()
    const location = useLocation()
    const [tab, setTab] = useState("emails")  
    const [search, setSearch] = useState("")  

    const SearchItem = () => {
        setSearch("")
    }

    const { camOn, startCapturing, stopCapturing, stressed } = useEmotion()

    const handleRecording = () => {
        if (!camOn) startCapturing()
        else stopCapturing()
    }

    useEffect(() => {
        // console.log("AppHeader, stressed: ", stressed)
    }, [stressed])

    return (
        <StyledAppBar 
            position = '' 
            sx = {{ flexGrow: 1 }}
        >
            <Toolbar style = {{ display: 'flex', flexDirection: "row" }}>
                <IconButton
                    size = "large"
                    edge = "start"
                    color = "inherit"
                    aria-label = "open sidebar"
                    sx = {{ mr: 2 }}
                >
                    <List 
                        color = "black" 
                        size = {20} 
                        onClick = {toggleSidebar} 
                    />
                </IconButton>

                {/* App logo */}
                <Typography 
                    noWrap
                    sx = {{ display: { xs: "none", sm: 'none', md: 'block' } }}
                    style = {{marginLeft: 0, color: "black"}}
                >
                    Wave
                </Typography>
                {/* <img src = {app_logo} alt = "logo" style = {{width: 100, marginLeft: 15}} /> */}

                <Box style = {{display: "flex", flexDirection: "row", flexGrow: 1, justifyContent: "center", alignItems: "center"}}>
                    <StyledCameraContainer onClick = {handleRecording} style = {camOn ? {backgroundColor: "lightgreen"} : {backgroundColor: "lightgray"}}>
                        <Camera color = 'inherit' size = {20} />
                    </StyledCameraContainer>

                    <SearchWrapper 
                        style = {{
                            boxShadow: `0px 1px 8px 1px ${stressed ? "hsl(297, 67%, 80%)" : Colours.normalShadow}`,
                            transition: 'box-shadow 0.5s ease-in'
                        }}
                    >
                        <InputBase 
                            placeholder = "Search" 
                            sx = {{ minWidth: { xs: 50, sm: 200, md: 500 } }} 
                            value = {search}
                            onChange = {(e) => setSearch(e.target.value)}
                        />
                        <Search color = "black" size = {20} onClick = {SearchItem} style = {{cursor: "pointer"}} />
                    </SearchWrapper>
                </Box>

                <TabsWrapper
                    sx = {{
                        // boxShadow: `1px 0px 5px 1px ${stressed ? "hsl(297, 67%, 80%)" : "hsl(239, 78%, 86%)"}`, 
                        // transition: 'box-shadow 0.5s ease-in',
                    }}
                >
                    <NavLink
                        to = "/emails" 
                    >
                        Emails
                    </NavLink>

                    <NavLink
                        to = "/tasks" 
                    >
                        Tasks
                    </NavLink>
                </TabsWrapper>
            </Toolbar>
        </StyledAppBar>
    )
}

export default AppHeader