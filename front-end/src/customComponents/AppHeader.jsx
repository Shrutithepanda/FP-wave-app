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
// const TabsWrapper = styled(Tabs) ({
    width: "15%",
    height: 50,
    display: "flex",
    marginRight: 20,
    background: "#ddd8d8",
    border: "0.5px solid #838383",
    borderRadius: 45,

    '& > a': {
        width: "50%",
        height: "100%",
        textDecoration: "none",
        color: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 45,
        // ⚠️ Only stays active for inbox, and projects pages, not others
        "&.active": {
            background: "#DDDDEE",
            border: "0.5px solid #7578BD"
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

    const routes = {
        0: "/emails",
        1: "/tasks"
    }

    const tabs = {
        "/emails": "0",
        "/tasks": "1"
    }

    const currentTab = tabs[location.pathname] || "0"
    // const [tab, setTab] = useState("0")

    const handleTabChange = (event, changedTab) => {
        setTab(changedTab)
        navigate(tabs[changedTab])
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
                            boxShadow: `0px 1px 7px 1px ${stressed ? "hsl(297, 67%, 80%)" : "hsl(239, 78%, 86%)"}`,
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
                        to = "/emails/inbox" 
                    >
                        Emails
                    </NavLink>

                    <NavLink
                        to = "/tasks/projects" 
                    >
                        Tasks
                    </NavLink>
                </TabsWrapper>
            </Toolbar>
        </StyledAppBar>
    )
}

export default AppHeader