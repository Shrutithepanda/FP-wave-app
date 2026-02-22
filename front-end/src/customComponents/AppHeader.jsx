import React, { useEffect, useState } from 'react'
import { Search, List, Camera } from 'react-bootstrap-icons'
import { AppBar, Toolbar, styled, InputBase, Box, Typography, IconButton } from '@mui/material'
import { useEmotion } from '../hooks/EmotionProvider'
import { NavLink } from 'react-router-dom'
import { Colours } from '../constants/colours'

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
    width: "15vw",
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
 * @returns a NavBar component with contents: Sidebar toggle button, camera icon, search bar, Emails/Tasks buttons
 */
const AppHeader = ({ toggleSidebar }) => {  
    const [search, setSearch] = useState("")  

    const SearchItem = () => {
        setSearch("")
    }

    // Get camera state (on/off), capturing functions and stressed value
    const { camOn, startCapturing, stopCapturing, stressed } = useEmotion()

    /**
     * Function to start and stop capturing
     */
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
                        color = "#000" 
                        size = {20} 
                        onClick = { toggleSidebar } 
                    />
                </IconButton>

                {/* App logo: renders for medium screen sizes and above */}
                <Typography 
                    noWrap
                    sx = {{ display: { xs: "none", sm: 'none', md: 'block' }, marginLeft: 0, color: "#000" }}
                >
                    Wave
                </Typography>
                {/* <img src = {app_logo} alt = "logo" style = {{width: 100, marginLeft: 15}} /> */}

                {/* Camera and Search bar */}
                <Box 
                    sx = {{ display: "flex", flexDirection: "row", flexGrow: 1, justifyContent: "center", alignItems: "center" }}
                >
                    {/* Camera button to start and stop recording */}
                    <StyledCameraContainer 
                        onClick = { handleRecording } 
                        sx = { camOn ? { backgroundColor: "lightgreen" } : { backgroundColor: "lightgray" } }
                    >
                        <Camera color = "inherit" size = {20} />
                    </StyledCameraContainer>

                    {/* Search bar */}
                    <SearchWrapper 
                        sx = {{
                            boxShadow: `0px 1px 8px 1px ${ stressed ? "hsl(297, 67%, 80%)" : Colours.normalShadow }`,
                            transition: 'box-shadow 0.5s ease-in'
                        }}
                    >
                        <InputBase 
                            placeholder = "Search" 
                            sx = {{ minWidth: { xs: 50, sm: 200, md: 500 } }} 
                            value = { search }
                            onChange = { (e) => setSearch(e.target.value) }
                        />
                        <Search color = "#000" size = {20} onClick = { SearchItem } style = {{ cursor: "pointer" }} />
                    </SearchWrapper>
                </Box>

                {/* Tab buttons to switch between Emails and Tasks tabs */}
                <TabsWrapper>
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