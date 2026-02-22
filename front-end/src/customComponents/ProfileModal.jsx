import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Dialog, IconButton, styled, Typography } from "@mui/material"
import { XLg } from 'react-bootstrap-icons'

import Loader from './Loader'
import { useAuth } from '../hooks/AuthProvider'
import { Colours } from '../constants/colours'

const dialogStyle = {
    height: 200,
    width: "50%",
    maxHeight: 200,
    maxWidth: "50%",
    boxShadow: "none",
    borderRadius: "10px",
}

const Header = styled(Box) ({
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 15px",
    background: Colours.cardBg,
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
    background: Colours.primary,
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

/**
 * 
 * @param {boolean} openProfile 
 * @param {function} setOpenProfile 
 * @returns a dialog containing user's email and a log out button
 */
const ProfileModal = ({ openProfile, setOpenProfile }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const { user, logout } = useAuth()

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

            // Logout and nabigate to Login page
            const error = await logout()
            navigate("/login")

            setLoading(false)

            // In case of error, log it to the console
            if (error) console.log("Error Logging out: ", error)
            
        } catch (error) {
            console.log("Error Logging out: ", error.message)
        }
    }

    return (
        <Box>
            <Dialog
                open = {openProfile}
                PaperProps = {{ sx: dialogStyle }}
                onClose = {(e) => closeDialog(e)}
            >
                {/* Header containing dialog title and clode button */}
               <Header>
                    <Typography>Profile</Typography>
                    <IconButton onClick = {(e) => closeDialog(e)} >
                        <XLg size = {15} color = "#000" />
                    </IconButton>
               </Header>

                {/* If loading show the loader otherwise show the content */}
                {loading
                    ? <Box sx = {{ display: "flex", justifyContent: "center", height: "100%" }}>
                        <Loader/>
                    </Box>
                    : <Box>
                        {/* User's email */}
                        <StyledText>
                            <Typography variant = "subtitle1">{ user?.email }</Typography>
                        </StyledText>

                        {/* Log out button */}
                        <Footer>
                            <StyledButton onClick = { (e) => handleLogout(e) }>
                                Logout
                            </StyledButton>
                        </Footer>
                    </Box>
                }
                
            </Dialog>
        </Box>
    )
}

export default ProfileModal