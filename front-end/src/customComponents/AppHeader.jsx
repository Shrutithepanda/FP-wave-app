import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { Search, List, Envelope, ListNested, Camera } from 'react-bootstrap-icons'
import { AppBar, Toolbar, styled, InputBase, Box, Typography, IconButton, Menu, MenuItem, Link } from '@mui/material'

const StyledAppBar = styled(AppBar) ({
    background: "#F5F5F5",
    boxShadow: 'none',
    width: "100vw"
})

const SearchWrapper = styled(Box) ({
    backgroundColor: "#cfe8f8",
    // marginLeft: 40,
    borderRadius: 20,
    // minWidth: 400,
    // maxWidth: 620,
    height: 48, 
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    '& > div': {
        // width: "100%",
        padding: "0 5px"
    }
})

const TabsWrapper = styled(Box) ({
    // width: "55%",
    display: "flex",
    justifyContent: "end",
    '& > a': {
        marginLeft: 20,
        cursor: "pointer"
    }
})

/**
 * 
 * @returns a `NavBar` bootstrap component with contents: Search bar, __, Emails/Tasks buttons
*/
const AppHeader = ({toggleSidebar}) => {  
    const [search, setSearch] = useState("")  

    const SearchItem = () => {
        setSearch("")
    }
    return (
        <StyledAppBar position = '' sx = {{ flexGrow: 1 }}>
            <Toolbar style = {{display: 'flex', flexDirection: "row"}}>
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
                    <Box style = {{display: "flex", alignItems: "center", backgroundColor: "lightgreen", borderRadius: 20, padding: 8, marginRight: 10}}>
                    <Camera color = 'inherit' size = {20} />
                    </Box>
                    <SearchWrapper>
                        <InputBase 
                            placeholder = "Search" 
                            sx = {{ minWidth: { xs: 50, sm: 400, md: 500 } }} 
                            value = {search}
                            onChange = {(e) => setSearch(e.target.value)}
                        />
                        <Search color = "black" size = {20} onClick = {SearchItem} style = {{cursor: "pointer"}} />
                    </SearchWrapper>
                </Box>

                <TabsWrapper>
                    <Link href = "/emails/inbox">
                        <Envelope color = "black" size = {20} aria-label = "Emails tab" />
                    </Link>

                    <Link href = "/tasks">
                        <ListNested color = "black" size = {20} aria-label = "Tasks tab" />
                    </Link>
                </TabsWrapper>
            </Toolbar>
        </StyledAppBar>
        
        // <Navbar collapseOnSelect expand = "md" bg = "light" className = "fixed-to p-3 d-flex justify-content-between">
        //     <Navbar.Brand href = "/emails">Wave</Navbar.Brand>
        //     <Navbar.Toggle aria-controls = "responsive-navbar-nav" />
        //     <Navbar.Collapse id = "responsive-navbar-nav" className = "">
        //         <Container className = "d-flex justify-content-around ">
        //         <Form className = "d-flex w-50 align-self-center" style = {{width: "0vw"}}>
        //             <Form.Control
        //                 type = "search"
        //                 placeholder = "Search"
        //                 className = "me-1"
        //                 aria-label = "Search"
        //             />
        //             <Button variant = "outline-secondary" style = {{border: "none"}} ><Search size = {20} /></Button>
        //         </Form>

        //         {/* <div>
        //             <p>Filter tags</p>
        //         </div> */}

        //         {/* PROBLEM: Even after switching tabs the Emails tab remains underlined */}
        //         <Nav variant = "underline" className = "justify-content-end" defaultActiveKey = "/emails">
        //             <Nav.Item>
        //                 <Nav.Link href = "/emails">Emails</Nav.Link>
        //             </Nav.Item>
        //             <Nav.Item>
        //                 <Nav.Link eventKey = "tasks" href = "/tasks">Tasks</Nav.Link>
        //             </Nav.Item>
        //         </Nav>
        //         </Container>
        //     </Navbar.Collapse>
        // </Navbar>
    )
}

export default AppHeader