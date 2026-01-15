import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Search } from 'react-bootstrap-icons'

/**
 * 
 * @returns a `NavBar` bootstrap component with contents: Search bar, __, Emails/Tasks buttons
 */
const AppHeader = () => {    
    return (
        <Navbar bg = "light">
            <Container>
                <Form className = "d-flex" style = {{width: "40vw"}}>
                    <Form.Control
                        type = "search"
                        placeholder = "Search"
                        className = "me-1"
                        aria-label = "Search"
                    />
                    <Button variant = "outline-secondary" style = {{border: "none"}} ><Search size = {20} /></Button>
                </Form>
                <Nav variant = "underline" className = "justify-content-end" defaultActiveKey = "/emails">
                    <Nav.Item>
                        <Nav.Link href = "/emails">Emails</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = "tasks" href = "/tasks">Tasks</Nav.Link>
                    </Nav.Item>
                </Nav>
                {/* <Nav>Tasks</Nav> */}
            </Container>
        </Navbar>
    )
}

export default AppHeader