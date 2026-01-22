import React from 'react'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
// import Container from 'react-bootstrap/Container'
import { PersonFill, PencilSquare, Archive, Send, Inbox, Trash3, FileEarmark, Check2Circle, ViewList, Display, CircleFill } from 'react-bootstrap-icons'
import { useState } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas'
import ProfileModal from './ProfileModal'

import { Drawer, Box, List, ListItem, styled, Button, Divider } from '@mui/material'
import ComposeMail from './ComposeMail'
import { useAuth } from '../hooks/AuthProvider'
import { NavLink, useParams } from 'react-router-dom'
import { routes } from '../constants/routes'
import { SIDERBAR_CONTENT } from './sidebar.config'

const Container = styled(Box) ({
    padding: 8,
    '& > ul': {
        padding: '10px 0 0 5px',
        fontSize: 15, 
        fontWeight: 500,
        cursor: "pointer",
        "& > a": {
            textDecoration: "none",
            color: "inherit"
        }
    },
    '& > ul > a > li > svg': {
        marginRight: 10
    }
})

const ComposeButton = styled(Box) ({
    background: "#C2E7FF",
    color: "#001D35",
    padding: 15,
    borderRadius: 16, 
    minWidth: 130,
    textTransform: "none",
    cursor: "pointer"
})

const SideBar = ({tasks = false, openSidebar}) => {
    const [openDialog, setOpenDialog] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const onComposeClick = () => setOpenDialog(true)
    const onProfileClick = () => setOpenProfile(true)

    const { type } = useParams()

    const handleRecording = () => {
        
    }

    return (
        tasks 
        ? <Card style = {{ width: "4rem", border: "none", alignItems: "center" }}> 
            <ListGroup variant = "flush" as = "ul">
                <ListGroup.Item as = "li" ><PersonFill size = {25} /></ListGroup.Item>
                <ListGroup.Item as = "li" ><PencilSquare size = {25} /></ListGroup.Item>
                <ListGroup.Item as = "li" style = {{borderRadius: "5px"}} active><ViewList size = {25} /></ListGroup.Item>
                <ListGroup.Item as = "li" ><Check2Circle size = {25} /></ListGroup.Item>
                <ListGroup.Item as = "li" ><Archive size = {25} /></ListGroup.Item>
                <ListGroup.Item as = "li" ><Trash3 size = {25} /></ListGroup.Item>
            </ListGroup>
        </Card>
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
                    background: "#F5F5F5",
                    borderRight: "none",
                    height: "calc(100vh = 64px)"
                }
            }}
        >
            <Container>
                <ListItem onClick = {() => onProfileClick()}>
                    <PersonFill color = "black" size = {20}  aria-label = "Profile" />
                </ListItem>

                <ComposeButton onClick = {() => onComposeClick()}>
                    <PencilSquare color = "black" size = {20}  aria-label = "Compose" style = {{marginRight: 10}} />
                    Compose
                </ComposeButton>
                <List>
                    { SIDERBAR_CONTENT.map(data => (
                        <NavLink key = {data.name} to = {`${routes.emails.path}/${data.name}`}>
                            <ListItem style = {type === data.name.toLowerCase() 
                                ? {
                                    backgroundColor: "#D3E3FD",
                                    borderRadius: "0 16px 16px 0",
                                } 
                                : {}}
                            >
                                {data.icon}{data.title}
                            </ListItem>
                                
                        </NavLink>
                        ))
                    }
                </List>

                {/* Record button */}
                <CircleFill size = {20} color = "green" onClick = {() => handleRecording()} style = {{marginTop: 50, marginLeft: 15, cursor: "pointer"}}  />
                
                {/* Profile modal - open when profile icon is clicked */}
                <ProfileModal openProfile = {openProfile} setOpenProfile = {setOpenProfile} />

                {/* Compose mail modal - open when compose button is clicked */}
                <ComposeMail openDialog = {openDialog} setOpenDialog = {setOpenDialog} />
            </Container>
        </Drawer>
        
    )
}

export default SideBar