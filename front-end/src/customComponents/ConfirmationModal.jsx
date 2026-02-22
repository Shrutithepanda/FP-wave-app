import Modal from 'react-bootstrap/Modal'
// import Button from 'react-bootstrap/Button'
import { useAuth } from '../hooks/AuthProvider'
import { useState } from 'react'
import Loader from './Loader'
// import Container from 'react-bootstrap/Container'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Dialog, IconButton, InputBase, styled, TextField, Typography } from "@mui/material"
import { XLg } from 'react-bootstrap-icons'
import { Colours } from '../constants/colours'

const dialogStyle = {
    height: 200,
    width: "40%",
    maxHeight: 200,
    maxWidth: "40%",
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
    justifyContent: "space-evenly",
    padding: "0 10px",
})

const ConfirmationModal = ({ openConfirmation, setOpenConfirmation, confirm, setConfirm }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    // const [, ] = useState(false)

    const closeDialog = (e) => {
        e.preventDefault() 
        setOpenConfirmation(false)
    }

    const handleConfirm = async (e) => {
        e.preventDefault()
        setConfirm(true)
    }

    return (
        <div>
            <Dialog
                open = { openConfirmation }
                PaperProps = {{ sx: dialogStyle }}
                onClose = { (e) => closeDialog(e) }
            >
               <Header>
                    <Typography>Delete</Typography>
                    <IconButton onClick = {(e) => closeDialog(e)} >
                        <XLg size = {12} color = "#000" />
                    </IconButton>
               </Header>

                {loading
                    ? <Box sx = {{display: "flex", justifyContent: "center", height: "100%"}}>
                        <Loader/>
                    </Box>
                    : <Box>
                        <StyledText>
                            <Typography variant = "subtitle1">Are you sure you want to delete?</Typography>
                        </StyledText>

                        <Footer>
                            <StyledButton onClick = {(e) => closeDialog(e)} sx = {{background: Colours.disabledBg, color: "#000"}}>
                                Cancel
                            </StyledButton>

                            <StyledButton onClick = {(e) => handleConfirm(e)} value = {confirm} sx = {{background: Colours.cancel}} >
                                Delete
                            </StyledButton>
                        </Footer>
                    </Box>
                }
            </Dialog>
        </div>
    )
}

export default ConfirmationModal