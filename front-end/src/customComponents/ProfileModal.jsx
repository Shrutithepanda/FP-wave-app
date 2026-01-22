import Modal from 'react-bootstrap/Modal'
// import Button from 'react-bootstrap/Button'
import { useAuth } from '../hooks/AuthProvider'
import { useState } from 'react'
import Loader from './Loader'
// import Container from 'react-bootstrap/Container'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Dialog, InputBase, styled, TextField, Typography } from "@mui/material"
import { XLg } from 'react-bootstrap-icons'

const dialogStyle = {
    height: "30%",
    width: "50%",
    maxHeight: "30%",
    maxWidth: "50%",
    boxShadow: "none",
    borderRadius: "10px"
}

const Header = styled(Box) ({
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 15px",
    background: "#F2F6FC",
    '& > p': {
        fontSize: 15,
    }
})

const RecipientsWrapper = styled(Box) ({
    display: "flex",
    flexDirection: "column",
    padding: "0px 15px",
    '& > div': {
        fontSize: 15,
        borderBottom: "1px solid #F5F5F5",
        marginTop: 10,
        padding: "10px 15px",
        alignItems: "center"
    }
})

const SendButton = styled(Button) ({
    background: "#0857D8",
    color: "#fff",
    borderRadius: 20,
    textTransform: "none",
    width: 70
})

const Footer = styled(Box) ({
    display: "flex",
    justifyContent: "space-between",
    padding: "0 15px",
})

const ProfileModal = ({ openProfile, setOpenProfile }) => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [loading, setLoading] = useState(false)

    const closeDialog = (e) => {
        e.preventDefault() 
        setOpenProfile(false)
    }

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
        // <Modal 
        //     {...props}
        //     size = "lg"
        //     // aria
        //     centered
        // >
        //     <Modal.Header closeButton>
        //         <Modal.Title id = "contained-modal-title-vcenter">
        //             Profile
        //         </Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body
        //         style = {{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}
        //     >
                // <h5>{user?.email}</h5>
                // {loading
                // ? 
                // <Container style = {{display: "flex", justifyContent: "center", alignItems: "center"}}>
                //         <Loader/>
                //     </Container>
                // : <Container style = {{display: "flex", justifyContent: "center", alignItems: "center"}}>
                //     <Button onClick = {handleLogout} style = {{width: "20vw"}}>Logout</Button>
                // </Container>
                // }
        //     </Modal.Body>
            
        // </Modal>
        <div>
            <Dialog
                open = {openProfile}
                PaperProps = {{sx: dialogStyle}}
                // sx = {{
                //     dialogStyle
                // }}
            >
               <Header>
                    <Typography>Profile</Typography>
                    <XLg onClick = {(e) => closeDialog(e)} style = {{cursor: "pointer"}} />
               </Header>

                <Typography variant = "h6">{user?.email}</Typography>
                <Box
                    style = {{display: "flex", justifyContent: "center", background: "lightgrey"}}
                >
                    {loading
                    ? 
                    <Box style = {{alignSelf: "start"}}>
                        <Loader/>
                    </Box>
                    : 
                    // <Container style = {{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Button onClick = {handleLogout} style = {{width: "20vw"}}>Logout</Button>
                    // </Container>
                    }
                </Box>

               {/* <Footer>
                    <SendButton onClick = {(e) => SendMail(e)} >
                        Send
                    </SendButton>

                    <Button>
                        <Trash3 onClick = {() => setOpenDialog(false)} />
                    </Button>
               </Footer> */}
            </Dialog>
        </div>
    )
}

export default ProfileModal