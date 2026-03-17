import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Search, Camera, LayoutSidebar, Envelope, ListCheck, InfoCircle } from 'react-bootstrap-icons'
import { AppBar, Toolbar, styled, InputBase, Box, Typography, IconButton, Tooltip } from '@mui/material'

import { useEmotion } from '../hooks/EmotionProvider'
import { Colours } from '../constants/colours'
import InfoModal from './InfoModal'

// Styled MUI components
const StyledAppBar = styled(AppBar) ({
    background: Colours.background,
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
    "& > div": {
        width: "100%",
        padding: "0 5px"
    }
})

const TabsWrapper = styled(Box) ({
    width: "10vw",
    height: 50,
    display: "flex",
    alignItems: "center",
    marginRight: 20,
    "& > a": {
        width: "50%",
        height: "100%",
        textDecoration: "none",
        color: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&.active": {
            borderBottom: `2px solid ${Colours.secondary}`,
            paddingTop: 0
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
 * @param {boolean} toggleSidebar 
 * @returns a NavBar component with contents: Sidebar toggle button, camera icon, search bar, info modal, Emails/Tasks buttons
 */
const AppHeader = ({ toggleSidebar }) => {  
    const [search, setSearch] = useState("")  
    const [openInfo, setOpenInfo] = useState(false)
    
    // Open dialog when info button is clicked
    const onInfoClick = () => setOpenInfo(true)

    const SearchItem = () => {
        setSearch("")
    }

    // Get camera state (on/off), capturing functions and stressed level value
    const { camOn, startCapturing, stopCapturing, stressLevel } = useEmotion()

    /**
     * Function to start and stop capturing
     */
    const handleRecording = () => {
        if (!camOn) startCapturing()
        else stopCapturing()
    }

    return (
        <StyledAppBar 
            position = '' 
            sx = {{ flexGrow: 1 }}
        >
            <Toolbar style = {{ display: 'flex', flexDirection: "row" }}>
                {/* Button to open/close the sidebar */}
                <Tooltip title = "Toggle sidebar">
                    <IconButton
                        size = "large"
                        edge = "start"
                        color = "inherit"
                        aria-label = "open sidebar"
                        sx = {{ mr: 2 }}
                        onClick = { toggleSidebar } 
                    >
                        <LayoutSidebar color = "#000" size = {20}/>
                    </IconButton>
                </Tooltip>

                {/* App name: renders for medium screen sizes and above */}
                <Typography 
                    variant = "h1"
                    noWrap
                    sx = {{ display: { xs: "none", sm: 'none', md: 'block' }, marginLeft: 0, color: "#000b5c", fontSize: 25 }}
                >
                    Wave
                </Typography>

                {/* Camera and Search bar */}
                <Box 
                    sx = {{ display: "flex", flexDirection: "row", flexGrow: 1, justifyContent: "center", alignItems: "center" }}
                >
                    {/* Camera button to start and stop recording */}
                    <Tooltip title = { camOn ? "Camera on" : "Camera off" }>
                    <StyledCameraContainer 
                        onClick = { handleRecording } 
                        sx = { camOn ? { backgroundColor: "#90EE91", border: "1px solid #90EE91" } : { background: "#E3E2E2", border: "1px solid #999898" } }
                    >
                        <Camera color = "inherit" size = {20} aria-label = { camOn ? "camera on" : "camera off" } />
                    </StyledCameraContainer>
                    </Tooltip>

                    {/* Search bar */}
                    <SearchWrapper 
                        sx = {{
                            // Change shadow colour based on stress levels
                            boxShadow: `0px 0px 10px 2px ${
                                stressLevel === "low" 
                                ? Colours.lowStressShadow 
                                : stressLevel === "medium"
                                ? Colours.mediumStressShadow
                                : stressLevel === "high" 
                                ? Colours.highStressShadow
                                : Colours.normalShadow
                            }`, 
                            transition: 'box-shadow 0.7s ease-in'
                        }}
                    >
                        <InputBase 
                            placeholder = "Search" 
                            aria-placeholder = "search"
                            aria-label = "search input area"
                            sx = {{ minWidth: { xs: 50, sm: 200, md: 500 } }} 
                            value = { search }
                            onChange = { (e) => setSearch(e.target.value) }
                        />
                        <Search 
                            color = "#000" 
                            size = {20} 
                            onClick = { SearchItem } 
                            style = {{ cursor: "pointer" }} 
                            aria-label = "search button"
                        />
                    </SearchWrapper>

                    {/* Info button */}
                    <Tooltip title = "Info">
                        <IconButton sx = {{ marginLeft: 1 }} onClick = { onInfoClick }>
                            <InfoCircle size = {20} aria-label = "open info" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Tab buttons to switch between Emails and Tasks tabs */}
                <TabsWrapper>
                    <Tooltip title = "Emails tab">
                        <NavLink
                            to = "/emails" 
                        >
                            <Envelope size = {20} />
                        </NavLink>
                    </Tooltip>

                    <Tooltip title = "Tasks tab">
                        <NavLink
                            to = "/tasks" 
                        >
                            <ListCheck size = {20} />
                        </NavLink>
                    </Tooltip>
                </TabsWrapper>

            </Toolbar>

            <InfoModal openInfo = { openInfo } setOpenInfo = { setOpenInfo } />
        </StyledAppBar>
    )
}

export default AppHeader