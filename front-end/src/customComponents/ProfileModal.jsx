import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useAuth } from '../hooks/AuthProvider'
import { useState } from 'react'
import Loader from './Loader'
import Container from 'react-bootstrap/Container'
import { useNavigate } from 'react-router-dom'

const ProfileModal = (props) => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [loading, setLoading] = useState(false)

    /**
     * 
     * Handle user log out.
     */
    const handleLogout = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const error = await logout()
            navigate("/login")
            setLoading(false)
            // if (error) throw error
            if (error) console.log("Error Logging out: ", error)
            
        } catch (error) {
            console.log("Error Logging out: ", error.message)
        }
    }

    return (
        <Modal 
            {...props}
            size = "lg"
            // aria
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id = "contained-modal-title-vcenter">
                    Profile
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                style = {{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}
            >
                <h5>{user?.email}</h5>
                {loading
                ? 
                <Container style = {{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Loader/>
                    </Container>
                : <Container style = {{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Button onClick = {handleLogout} style = {{width: "20vw"}}>Logout</Button>
                </Container>
                }
            </Modal.Body>
            
        </Modal>
    )
}

export default ProfileModal