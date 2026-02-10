import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { PersonFill, PencilSquare } from 'react-bootstrap-icons'
import { Drawer, Box, List, ListItem, styled, IconButton, Typography } from '@mui/material'

import { EMAIL_SIDERBAR_CONTENT, TASK_SIDERBAR_CONTENT } from './sidebar.config'
import { routes } from '../constants/routes'
import ProfileModal from './ProfileModal'
import ComposeMail from './ComposeMail'
import { Colours } from '../constants/colours'
import { useEmotion } from '../hooks/EmotionProvider'

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
    borderRadius: 30,
    padding: "3px 10px 3px 10px",
    // background: "#DEDEDE",
    // border: "1.5px solid gray",
})

const SideBar = ({ tasks = false, openSidebar }) => {
    const [openDialog, setOpenDialog] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const onComposeClick = () => setOpenDialog(true)
    const onProfileClick = () => setOpenProfile(true)

    const { type } = useParams()
    const { stressed } = useEmotion()

    return (
        tasks 
            // Sidebar for Tasks page
            ? <Drawer 
                anchor = "left" 
                open = {openSidebar}
                hideBackdrop 
                ModalProps = {{keepMounted: true}}
                variant = "persistent"
                sx = {{
                    '& .MuiDrawer-paper': {
                        marginTop: "64px",
                        width: 150,
                        background: "#F0F0F0",
                        borderRight: "none",
                        height: "calc(100vh - 64px)"
                    }
                }}
            >
                <Container>
                    <IconButton onClick = {() => onProfileClick()} sx = {{ marginLeft: 2 }}>
                        <PersonFill color = "black" size = {20}  aria-label = "Profile" />
                    </IconButton>

                    <ComposeButton onClick = {() => onComposeClick()}>
                        <PencilSquare color = "black" size = {20}  aria-label = "Compose" style = {{marginRight: 10}} />
                        Compose
                    </ComposeButton>
                    <List>
                        { TASK_SIDERBAR_CONTENT.map(data => (
                                <NavLink key = {data.name} to = {`${routes.emails.path}/${data.name}`}>
                                    <ListItem style = {type === data.name.toLowerCase() 
                                        ? {
                                            backgroundColor: Colours.selectedType,
                                            borderRadius: "0 16px 16px 0",
                                            // borderRadius: "16px",
                                            border: "0.5px solid #94509e",
                                        } 
                                        : {}}
                                    >
                                        {data.icon}{data.title}
                                    </ListItem>
                                        
                                </NavLink>
                            ))
                        }
                    </List>
                    
                    {/* Indicator for Calm mode */}
                    <Box sx = {{marginTop: "calc(100vh - 450px)", alignSelf: "center"}}>
                        <Indicator 
                            sx = {{
                                background: stressed ? "#b6f8b8" : Colours.disabledBg,
                                color: stressed ? "#1e5c21" : "#666666",
                                border: stressed ? `1.5px solid #66ee6d` : `1.5px solid #c8c6c6`,
                                boxShadow: `0px 2px 7px 2px ${stressed ? "#9efba1" : Colours.disabledBg}`
                            }}
                        >
                            Calm Mode
                        </Indicator>
                    </Box>
                    
                    {/* Profile modal - opens when profile icon is clicked */}
                    <ProfileModal openProfile = {openProfile} setOpenProfile = {setOpenProfile} />

                    {/* Compose mail modal - opens when compose button is clicked */}
                    {/* <ComposeMail openDialog = {openDialog} setOpenDialog = {setOpenDialog} /> */}
                </Container>
            </Drawer>

            // Sidebar for Emails page
            : <Drawer 
                anchor = "left" 
                open = {openSidebar}
                hideBackdrop 
                ModalProps = {{keepMounted: true}}
                variant = "persistent"
                sx = {{
                    '& .MuiDrawer-paper': {
                        marginTop: "64px",
                        width: 150,
                        background: "#F0F0F0",
                        borderRight: "none",
                        height: "calc(100vh - 64px)"
                    }
                }}
            >
                <Container>
                    <IconButton onClick = {() => onProfileClick()} sx = {{ marginLeft: 2 }}>
                        <PersonFill color = "black" size = {20}  aria-label = "Profile" />
                    </IconButton>

                    <ComposeButton onClick = {() => onComposeClick()}>
                        <PencilSquare color = "black" size = {20}  aria-label = "Compose" style = {{marginRight: 10}} />
                        Compose
                    </ComposeButton>
                    <List>
                        { EMAIL_SIDERBAR_CONTENT.map(data => (
                                <NavLink key = {data.name} to = {`${routes.emails.path}/${data.name}`}>
                                    <ListItem style = {type === data.name.toLowerCase() 
                                        ? {
                                            backgroundColor: Colours.selectedType,
                                            borderRadius: "0 16px 16px 0",
                                            // borderRadius: "16px",
                                            border: "0.5px solid #94509E",
                                        } 
                                        : {}}
                                    >
                                        {data.icon}{data.title}
                                    </ListItem>
                                        
                                </NavLink>
                            ))
                        }
                    </List>

                    {/* Indicator for Calm mode */}
                    <Box sx = {{marginTop: "calc(100vh - 450px)", alignSelf: "center"}}>
                        <Indicator 
                            sx = {{
                                background: stressed ? "#b6f8b8" : Colours.disabledBg,
                                color: stressed ? "#1e5c21" : "#666666",
                                border: stressed ? `1.5px solid #66ee6d` : `1.5px solid #c8c6c6`,
                                boxShadow: `0px 2px 7px 2px ${stressed ? "#9efba1" : Colours.disabledBg}`
                            }}
                        >
                            Calm Mode
                        </Indicator>
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