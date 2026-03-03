import React, { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { PersonFill, PencilSquare, CircleFill } from 'react-bootstrap-icons'
import { Drawer, Box, List, ListItem, styled, IconButton, Typography, Button } from '@mui/material'

import { EMAIL_SIDERBAR_CONTENT, TASK_SIDERBAR_CONTENT } from './sidebar.config'
import { routes } from '../constants/routes'
import { Colours } from '../constants/colours'
import { useEmotion } from '../hooks/EmotionProvider'
import ProfileModal from './ProfileModal'
import ComposeMail from './ComposeMail'
import ComposeProject from './ComposeProject'

const Container = styled(Box) ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "0 8px 0 0",
    "& > ul": {
        padding: "10px 0 0 5px",
        fontSize: 15, 
        fontWeight: 500,
        cursor: "pointer",
        "& > a": {
            textDecoration: "none",
            color: "inherit",
        }
    },
    "& > ul > a > li > svg": {
        marginRight: 10
    }
})

const ComposeButton = styled(Box) ({
    background: "#CFA9EF",
    color: "#001D35",
    padding: 15,
    marginLeft: 8,
    borderRadius: 16, 
    minWidth: 130,
    textTransform: "none",
    cursor: "pointer"
})

const Indicator = styled(Typography) ({
    "& > svg": {
        marginRight: 7,
        marginBottom: 3
    }
})

/**
 * 
 * @param {boolean} tasks 
 * @param {boolean} openSidebar 
 * @returns a container with contents of the sidebar based on the current tab
 */
const SideBar = ({ tasks = false, openSidebar }) => {
    const [openDialog, setOpenDialog] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const [on, setOn] = useState(false)

    // Open dialogs when repsective buttons are clicked
    const onComposeClick = () => setOpenDialog(true)
    const onProfileClick = () => setOpenProfile(true)

    // Get current page's type from params
    const { type } = useParams()

    // Get current value of stressed
    const { stressed, stressLevel, startCapturing, stopCapturing, setStressed, setStressLevel } = useEmotion()

    /**
     * Turn adaptive mode on
     */
    const turnOn = () => {
        startCapturing()
        setOn(true)
    }

    /**
     * Turn adaptive mode off
     */
    const turnOff = () => {
        stopCapturing()
        setStressLevel("normal")
        setStressed(false)
        setOn(false)
    }

    return (
        tasks 
            // Sidebar for Tasks page
            ? <Drawer 
                anchor = "left" 
                open = { openSidebar }
                hideBackdrop 
                ModalProps = {{ keepMounted: true }}
                variant = "persistent"
                sx = {{
                    '& .MuiDrawer-paper': {
                        marginTop: "64px",
                        width: 150,
                        background: Colours.background,
                        borderRight: "none",
                        height: "calc(100vh - 64px)"
                    }
                }}
            >
                <Container>
                    {/* Profile icon */}
                    <IconButton onClick = { onProfileClick } sx = {{ marginLeft: 2 }}>
                        <PersonFill color = "#000" size = {20}  aria-label = "Profile" />
                    </IconButton>

                    {/* Compose button */}
                    <ComposeButton onClick = { onComposeClick }>
                        <PencilSquare color = "#000" size = {20}  aria-label = "Compose" style = {{ marginRight: 10 }} />
                        Compose
                    </ComposeButton>

                    {/* List containing links to pages corresponding to the Tasks tab */}
                    <List>
                        { TASK_SIDERBAR_CONTENT.map(data => (
                                // Navigate to the path containing the item name
                                <NavLink key = {data.name} to = {`${routes.tasks.path}/${data.name}`}>
                                    {/* Render the list item */}
                                    <ListItem style = { type === data.name.toLowerCase() 
                                            ? {
                                                backgroundColor: Colours.selectedType,
                                                borderRadius: "0 16px 16px 0",
                                                border: "0.5px solid #94509e",
                                            } 
                                            : {}
                                        }
                                    >
                                        {data.icon}{data.title}
                                    </ListItem>
                                        
                                </NavLink>
                            ))
                        }
                    </List>
                    
                    {/* Indicator for Calm mode */}
                    <Box sx = {{ marginTop: "calc(100vh - 450px)", alignSelf: "flex-end" }}>
                        <Indicator>
                            <CircleFill size = {10} color = {stressed ? "#27CF4E" : "#666666"} />
                            Adaptive Mode
                        </Indicator>
                        { on
                            ? <Button 
                                onClick = { turnOff }
                                sx = {{ textTransform: "none", fontSize: 15, color: Colours.primary }}
                            >
                                Turn off?
                            </Button>

                            : <Button 
                                onClick = { turnOn }
                                sx = {{ textTransform: "none", fontSize: 15, color: Colours.primary }}
                            >
                                Turn on?
                            </Button>
                        }
                        {stressLevel}
                    </Box>
                    
                    {/* Profile modal - opens when profile icon is clicked */}
                    <ProfileModal openProfile = {openProfile} setOpenProfile = {setOpenProfile} />

                    {/* Compose project modal - opens when compose button is clicked */}
                    <ComposeProject openDialog = {openDialog} setOpenDialog = {setOpenDialog} />
                </Container>
            </Drawer>

            // Sidebar for Emails page
            : <Drawer 
                anchor = "left" 
                open = { openSidebar }
                hideBackdrop 
                ModalProps = {{ keepMounted: true }}
                variant = "persistent"
                sx = {{
                    '& .MuiDrawer-paper': {
                        marginTop: "64px",
                        width: 150,
                        background: Colours.background,
                        borderRight: "none",
                        height: "calc(100vh - 64px)"
                    }
                }}
            >
                <Container>
                    {/* Profile icon */}
                    <IconButton onClick = { onProfileClick } sx = {{ marginLeft: 2 }}>
                        <PersonFill color = "#000" size = {20}  aria-label = "Profile" />
                    </IconButton>

                    {/* Compose button */}
                    <ComposeButton onClick = { onComposeClick }>
                        <PencilSquare color = "#000" size = {20}  aria-label = "Compose" style = {{ marginRight: 10 }} />
                        Compose
                    </ComposeButton>

                    {/* List containing links to pages corresponding to the Emails tab */}
                    <List>
                        { EMAIL_SIDERBAR_CONTENT.map(data => (
                                // Navigate to the path containing the item name
                                <NavLink key = {data.name} to = {`${routes.emails.path}/${data.name}`}>
                                    {/* Render the list item */}
                                    <ListItem style = { type === data.name.toLowerCase() 
                                            ? {
                                                backgroundColor: Colours.selectedType,
                                                borderRadius: "0 16px 16px 0",
                                                border: "0.5px solid #94509E",
                                            } 
                                            : {}
                                        }
                                    >
                                        {data.icon}{data.title}
                                    </ListItem>
                                        
                                </NavLink>
                            ))
                        }
                    </List>

                    {/* Indicator for Calm mode */}
                    <Box sx = {{ marginTop: "calc(100vh - 460px)", alignSelf: "flex-end" }}>
                        <Indicator>
                            <CircleFill size = {10} color = {stressed ? "#27CF4E" : "#666666"} />
                            Adaptive Mode
                        </Indicator>
                        { on
                            ? <Button 
                                onClick = { turnOff }
                                sx = {{ textTransform: "none", fontSize: 15, color: Colours.primary }}
                            >
                                Turn off?
                            </Button>

                            : <Button 
                                onClick = { turnOn }
                                sx = {{ textTransform: "none", fontSize: 15, color: Colours.primary }}
                            >
                                Turn on?
                            </Button>
                        }
                        {stressLevel}
                    </Box>
                    
                    {/* Profile modal - opens when profile icon is clicked */}
                    <ProfileModal openProfile = {openProfile} setOpenProfile = {setOpenProfile} />

                    {/* Compose mail modal - opens when compose button is clicked */}
                    <ComposeMail openDialog = {openDialog} setOpenDialog = {setOpenDialog} />
                </Container>
            </Drawer>
    )
}

export default SideBar