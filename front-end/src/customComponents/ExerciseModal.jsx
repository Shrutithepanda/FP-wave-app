import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Dialog, IconButton, styled, Typography } from "@mui/material"
import { BorderWidth, Circle, CircleFill, XLg } from 'react-bootstrap-icons'

import { Colours } from '../constants/colours'
import { useEmotion } from '../hooks/EmotionProvider'

const dialogStyle = {
    height: 500,
    width: "50%",
    maxHeight: 500,
    maxWidth: "50%",
    boxShadow: "none",
    borderRadius: "10px",
}

const Header = styled(Box) ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginTop: 20
})

const StyledBox = styled(Box) ({
    display: "flex", 
    width: "40%", 
    height: "50%", 
    alignSelf: "center", 
    justifyContent: "center", 
    alignItems: "center",
    borderRadius: 50
})

const StyledPrimaryButton = styled(Button) ({
    background: Colours.primary,
    color: "#FFF",
    borderRadius: 20,
    textTransform: "none",
    width: 90
})

const StyledSecondaryButton = styled(Button) ({
    border: `1px solid ${Colours.secondary}`,
    color: "#000",
    borderRadius: 20,
    textTransform: "none",
    width: 90
})

const Footer = styled(Box) ({
    display: "flex",
    justifyContent: "space-around",
    padding: "0 25px",
})

const shades = {
    0: "rgba(95, 191, 249, 0.2)",

    // Increasing opacity when breathing in
    1: "rgba(95, 191, 249, 0.2)",
    2: "rgba(95, 191, 249, 0.4)",
    3: "rgba(95, 191, 249, 0.6)",
    4: "rgba(95, 191, 249, 0.8)",
    
    // Consistent colour when holding the breath
    5: "rgba(95, 191, 249, 0.8)",
    6: "rgba(95, 191, 249, 0.8)",
    7: "rgba(95, 191, 249, 0.8)",
    8: "rgba(95, 191, 249, 0.8)",
    
    // Decreasing opacity when breathing
    9: "rgba(95, 191, 249, 0.8)",
    10: "rgba(95, 191, 249, 0.6)",
    11: "rgba(95, 191, 249, 0.4)",
    12: "rgba(95, 191, 249, 0.2)",

    // Consistent colour when holding the breath
    13: "rgba(95, 191, 249, 0.2)",
    14: "rgba(95, 191, 249, 0.2)",
    15: "rgba(95, 191, 249, 0.2)",
}

/**
 * 
 * @param {boolean} openProfile 
 * @param {function} setOpenProfile 
 * @returns a dialog containing the breathing exercise
 */
const ExerciseModal = ({ openExercise, setOpenExercise }) => {
    const [startCount, setStartCount] = useState(false)
    const [count, setCount] = useState(0)

    const { startCapturing , stopCapturing } = useEmotion()

    useEffect(() => {
        if (openExercise) stopCapturing()
    }, [openExercise])

    /**
     * Start counting
     */
    const start = () => {
        setStartCount(true)
    }

    // When modal is open, stop the camera, start again when closed
    
    
    useEffect(() => {
        // If counting has started increase the count every 1.2 seconds
        if (startCount) {
            const interval = setInterval(() => {
                setCount((prevIndex) => (prevIndex + 1) % 16)
            }, 1200)

            return () => clearInterval(interval)
        }
    }, [startCount])

    /**
     * Close the dialog 
     * @param {*} e 
     */
    const closeDialog = (e) => {
        e.preventDefault() 
        setCount(0)
        setStartCount(false)
        setOpenExercise(false)
        startCapturing()
    }

    return (
        <Box>
            <Dialog
                open = { openExercise }
                PaperProps = {{ sx: dialogStyle }}
                onClose = {(e) => closeDialog(e)}
            >
                {/* Header containing dialog title and clode button */}
               <Header>
                    <Typography>Box Breathing Exercise</Typography>
                    <IconButton onClick = { (e) => closeDialog(e) } >
                        <XLg size = {15} color = "#000" />
                    </IconButton>
               </Header>

                {/* Breathing instructions based on count, adaptive colour box, and footer */}
                <Box sx = {{ display: "flex", flexDirection: "column", height: "85%", justifyContent: "space-between" }}>
                    <StyledText>
                        <Typography variant = "h6">
                            { count > 0 && count <=4 
                                ? "Breathe in"
                                : count > 4 && count <= 8 
                                ? "Hold..."
                                : count > 8 && count <= 12
                                ? "Breathe out"
                                : count > 12 && count <= 16
                                ? "Hold..."
                                : "Let's go!"
                            }
                        </Typography>
                    </StyledText>

                    {/* Adaptive colour box, based on count */}
                    <StyledBox sx = {{ 
                            background: shades[count % 16], 
                            transition: "background 0.7s ease-in" ,
                        }}
                    >
                        <Typography sx = {{ fontSize: 25 }}>{ count % 4 }</Typography>
                    </StyledBox>
                       
                    {/* Start and Complete buttons */}
                    <Footer>
                        <StyledPrimaryButton onClick = { start }>
                            Start
                        </StyledPrimaryButton>

                        <StyledSecondaryButton onClick = { (e) => closeDialog(e) }>
                            Complete
                        </StyledSecondaryButton>
                    </Footer>
                </Box>
                
            </Dialog>
        </Box>
    )
}

export default ExerciseModal