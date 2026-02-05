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
    borderRadius: "10px",
}

const Header = styled(Box) ({
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 15px",
    background: "#EEEEF7",
    '& > p': {
        fontSize: 15,
    }
})

const StyledText = styled(Box) ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginTop: 10,
})

const StyledButton = styled(Button) ({
    background: "#42458A",
    color: "#FFF",
    borderRadius: 20,
    textTransform: "none",
    width: 90
})

const Footer = styled(Box) ({
    display: "flex",
    justifyContent: "center",
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
        <div>
            <Dialog
                open = {openProfile}
                PaperProps = {{ sx: dialogStyle }}
                onClose = {(e) => closeDialog(e)}
            >
               <Header>
                    <Typography>Profile</Typography>
                    <XLg onClick = {(e) => closeDialog(e)} style = {{cursor: "pointer"}} />
               </Header>

                {loading
                    ? <Box sx = {{display: "flex", justifyContent: "center", height: "100%"}}>
                        <Loader/>
                    </Box>
                    : <Box>
                        <StyledText>
                            <Typography variant = "subtitle1">{user?.email}</Typography>
                        </StyledText>

                        <Footer>
                            <StyledButton onClick = {(e) => handleLogout(e)} style = {{width: ""}}>
                                Logout
                            </StyledButton>
                        </Footer>
                    </Box>
                }
            </Dialog>
        </div>
    )
}

export default ProfileModal