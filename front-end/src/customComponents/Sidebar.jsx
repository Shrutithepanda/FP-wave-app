import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Nav from 'react-bootstrap/Nav'
import { PersonFill, PencilSquare, Archive, Send, Inbox, Trash3, FileEarmark, Check2Circle, ViewList } from 'react-bootstrap-icons'
import { useState } from 'react'
import ProfileModal from './ProfileModal'


const SideBar = ({tasks = false}) => {
    const [showModal, setShowModal] = useState(false)
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
        : <Card style = {{ width: "4rem", border: "none", alignItems: "center" }}>
            {/* Keep a default colour for each link, on active change the bg colour */}
            <Card.Body >
                <Card.Link onClick = {() => setShowModal(true)}>
                    <PersonFill color = "black" size = {25}  aria-label = "Profile" />
                </Card.Link>
                <ProfileModal
                    show = {showModal}
                    onHide = {() => setShowModal(false)}
                />
            </Card.Body>

            <Card.Body >
                <Card.Link>
                    <PencilSquare color = "black" size = {25}  aria-label = "Compose" />
                </Card.Link>
            </Card.Body>

            <Card.Body style = {{borderRadius: "5px", backgroundColor: "lavender"}}>
                <Card.Link href = "/emails" >
                    <Inbox color = "black" size = {25}  aria-label = "Inbox" />
                </Card.Link>
            </Card.Body>

            <Card.Body >
                <Card.Link>
                    <Send color = "black" size = {25} aria-label = "Sent" />
                </Card.Link>
            </Card.Body>

            <Card.Body >
                <Card.Link>
                    <FileEarmark color = "black" size = {25}  aria-label = "Drafts" />
                </Card.Link>    
            </Card.Body>

            <Card.Body >
                <Card.Link>
                    <Archive color = "black" size = {25}  aria-label = "Archive" />
                </Card.Link>    
            </Card.Body>

            <Card.Body >
                <Card.Link>
                    <Trash3 color = "black" size = {25}  aria-label = "Trash" />
                </Card.Link>    
            </Card.Body>

            {/* <ListGroup variant = "flush" as = "ul">
                <ListGroup.Item as = "li" ><PersonFill size = {25} /></ListGroup.Item>
                <ListGroup.Item as = "li" ><PencilSquare size = {25} /></ListGroup.Item>
                <ListGroup.Item as = "li" style = {{borderRadius: "5px"}} active><Inbox size = {25} /></ListGroup.Item>
                <ListGroup.Item as = "li" ><Send size = {25} /></ListGroup.Item>
                <ListGroup.Item as = "li" ><FileEarmark size = {25} /></ListGroup.Item>
                <ListGroup.Item as = "li" ><Archive size = {25} /></ListGroup.Item>
                <ListGroup.Item as = "li" ><Trash3 size = {25} /></ListGroup.Item>
            </ListGroup> */}
        </Card>
        
    )
}

export default SideBar