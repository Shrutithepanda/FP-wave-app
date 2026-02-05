import React, { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { PersonFill, PencilSquare } from 'react-bootstrap-icons'
import { Drawer, Box, List, ListItem, styled, IconButton } from '@mui/material'

import { EMAIL_SIDERBAR_CONTENT, TASK_SIDERBAR_CONTENT } from './sidebar.config'
import { routes } from '../constants/routes'
import ProfileModal from './ProfileModal'
import ComposeMail from './ComposeMail'

const Container = styled(Box) ({
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
    background: "#BABBDE",
    color: "#001D35",
    padding: 15,
    marginLeft: 8,
    borderRadius: 16, 
    minWidth: 130,
    textTransform: "none",
    cursor: "pointer"
})

const SideBar = ({ tasks = false, openSidebar }) => {
    const [openDialog, setOpenDialog] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const onComposeClick = () => setOpenDialog(true)
    const onProfileClick = () => setOpenProfile(true)

    const { type } = useParams()

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
                                            backgroundColor: "#DDDDEE",
                                            borderRadius: "0 16px 16px 0",
                                            // borderRadius: "16px",
                                            border: "0.5px solid #7578BD",
                                        } 
                                        : {}}
                                    >
                                        {data.icon}{data.title}
                                    </ListItem>
                                        
                                </NavLink>
                            ))
                        }
                    </List>
                    
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
                                            backgroundColor: "#DDDDEE",
                                            borderRadius: "0 16px 16px 0",
                                            // borderRadius: "16px",
                                            border: "0.5px solid #7578BD",
                                        } 
                                        : {}}
                                    >
                                        {data.icon}{data.title}
                                    </ListItem>
                                        
                                </NavLink>
                            ))
                        }
                    </List>
                    
                    {/* Profile modal - opens when profile icon is clicked */}
                    <ProfileModal openProfile = {openProfile} setOpenProfile = {setOpenProfile} />

                    {/* Compose mail modal - opens when compose button is clicked */}
                    <ComposeMail openDialog = {openDialog} setOpenDialog = {setOpenDialog} />
                </Container>
            </Drawer>
    )
}

export default SideBar