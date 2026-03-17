import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Dialog, IconButton, styled, Typography } from "@mui/material"
import { XLg } from 'react-bootstrap-icons'

import { Colours } from '../constants/colours'
import { useEmotion } from '../hooks/EmotionProvider'

// Styled MUI components
const dialogStyle = {
    height: 700,
    width: "50%",
    maxHeight: 700,
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
    "& > p": {
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

const SelecteExerciseButton = styled(Button) ({
    color: "#000",
    borderRadius: 20,
    textTransform: "none",
    width: 200,
    marginTop: 15
})

const Footer = styled(Box) ({
    display: "flex",
    justifyContent: "space-around",
    padding: "0 25px",
})

// Count and shades for box breathing exercise
const boxBreathingCount = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 
    5: 1, 6: 2, 7: 3, 8: 4,
    9: 1, 10: 2, 11: 3, 12: 4,
    13: 1, 14: 2, 15: 3,
}

const boxBreathingShades = {
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
    
    // Decreasing opacity when breathing out
    9: "rgba(95, 191, 249, 0.8)",
    10: "rgba(95, 191, 249, 0.6)",
    11: "rgba(95, 191, 249, 0.4)",
    12: "rgba(95, 191, 249, 0.2)",

    // Consistent colour when holding the breath
    13: "rgba(95, 191, 249, 0.2)",
    14: "rgba(95, 191, 249, 0.2)",
    15: "rgba(95, 191, 249, 0.2)",
}

// Count and shades for long exhale exercise
const longExhaleCount = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4,
    5: 1, 6: 2, 7: 3, 8: 4, 9: 5, 10: 6, 11: 7,
}

const longExhaleShades = {
    0: "rgba(95, 249, 177, 0.2)",

    // Increasing opacity when breathing in
    1: "rgba(95, 249, 177, 0.4)",
    2: "rgba(95, 249, 177, 0.6)",
    3: "rgba(95, 249, 177, 0.8)",
    4: "rgba(95, 249, 177, 1)",
    
    // Decreasing opacity when breathing out
    5: "rgba(95, 249, 177, 0.9)",
    6: "rgba(95, 249, 177, 0.8)",
    7: "rgba(95, 249, 177, 0.7)",
    8: "rgba(95, 249, 177, 0.6)",
    9: "rgba(95, 249, 177, 0.5)",
    10: "rgba(95, 249, 177, 0.4)",
    11: "rgba(95, 249, 177, 0.3)",
    12: "rgba(95, 249, 177, 0.2)",
}

/**
 * 
 * @param {boolean} openProfile 
 * @param {function} setOpenProfile 
 * @returns a dialog containing the breathing exercises - box breathing and long exhale
 */
const ExerciseModal = ({ openExercise, setOpenExercise }) => {
    const [startCount, setStartCount] = useState(false)
    const [selected, setSelected] = useState("box_breathing")
    const [count, setCount] = useState(0)

    const { startCapturing , stopCapturing } = useEmotion()

    // If dialog is opened stop the camera
    useEffect(() => {
        if (openExercise) stopCapturing()
    }, [openExercise])

    /**
     * Start counting
     */
    const start = () => {
        setStartCount(true)
    }
    
    useEffect(() => {
        // If counting has started increase the count every 1.2 seconds based on the selected exercise
        if (startCount && selected === "box_breathing") {
            const interval = setInterval(() => {
                setCount((prevIndex) => (prevIndex + 1) % 16)
            }, 1200)
            
            return () => clearInterval(interval)
        }
        else if (startCount && selected === "long_exhale") {
            const interval = setInterval(() => {
                setCount((prevIndex) => (prevIndex + 1) % 12)
            }, 1200)
    
            return () => clearInterval(interval)
        }

    }, [startCount])

    /**
     * Close the dialog and set values back to their defaults
     * @param {*} e 
     */
    const closeDialog = (e) => {
        e.preventDefault() 
        setCount(0)
        setStartCount(false)
        setOpenExercise(false)
        startCapturing()
    }

    /**
     * Set the breathing exercise to box breathing exercise. Reset count and stop counting when switched.
     */
    const boxBreathing = () => {
        setSelected("box_breathing")
        setStartCount(false)
        setCount(0)
    }

    /**
     * Set the breathing exercise to long exhale exercise. Reset count and stop counting when switched.
     */
    const longExhale = () => {
        setSelected("long_exhale")
        setStartCount(false)
        setCount(0)
    }

    return (
        <Box>
            <Dialog
                open = { openExercise }
                PaperProps = {{ sx: dialogStyle }}
                onClose = {(e) => closeDialog(e)}
            >
                {/* Header containing dialog title and close button */}
               <Header>
                    <Typography>Breathing Exercises</Typography>
                    <IconButton onClick = { (e) => closeDialog(e) } >
                        <XLg size = {15} color = "#000" aria-label = "close breathing exercise dialog" />
                    </IconButton>
               </Header>

               {/* Buttons to switch between the exercises */}
               <Box sx = {{ display: "flex", justifyContent: "space-around" }}>
                    <SelecteExerciseButton
                        onClick = { boxBreathing }
                        sx = {{ 
                            background: selected === "box_breathing" ? Colours.inProgressBg : "", 
                            border: `1px solid ${Colours.inProgressCircle}` 
                        }}
                    >
                        Box breathing
                    </SelecteExerciseButton>

                    <SelecteExerciseButton
                        onClick = { longExhale }
                        sx = {{ 
                            background: selected === "long_exhale" ? Colours.completedBg : "", 
                            border: `1px solid ${Colours.completedCircle}` 
                        }}
                    >
                        Long exhale
                    </SelecteExerciseButton>
               </Box>

                {/* Show the selected breathing exercise */}
                { selected === "box_breathing" 
                    ? 
                    <Box sx = {{ display: "flex", flexDirection: "column", height: "85%", justifyContent: "space-around" }}>
                        {/* Breathing instructions based on count, adaptive colour box, and footer */}
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
                                background: boxBreathingShades[count % 16], 
                                transition: "background 0.7s ease-in",
                                height: 250
                            }}
                        >
                            <Typography sx = {{ fontSize: 25 }}>{ boxBreathingCount[count] }</Typography>
                        </StyledBox>

                        {/* Tip */}
                        <Typography sx = {{ alignSelf: "center" }}>
                                Sit up straight. Breathe into your stomach for 4, hold for 4 and breathe out for 4.
                        </Typography>
                        
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
                    
                    : selected === "long_exhale"
                        ? <Box sx = {{ display: "flex", flexDirection: "column", height: "85%", justifyContent: "space-around" }}>
                            {/* Breathing instructions based on count, adaptive colour box, and footer */}
                            <StyledText>
                                <Typography variant = "h6">
                                    { count > 0 && count <=4 
                                        ? "Breathe in"
                                        : count > 4 && count <= 12 
                                        ? "Breathe out"
                                        : "Let's go!"
                                    }
                                </Typography>
                            </StyledText>

                            {/* Adaptive colour box, based on count */}
                            <StyledBox sx = {{ 
                                    background: longExhaleShades[count % 12], 
                                    transition: "background 0.7s ease-in",
                                    height: 250,
                                    borderTopRightRadius: 20,
                                    borderBottomLeftRadius: 20,
                                }}
                            >
                                <Typography sx = {{ fontSize: 25 }}>{ longExhaleCount[count] }</Typography>
                            </StyledBox>

                            {/* Tip */}
                            <Typography sx = {{ alignSelf: "center" }}>
                                Sit up straight. Breathe into your stomach for 4 and breathe out slowly for 8.
                            </Typography>
                            
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
                        :  <></> 
                }
                
            </Dialog>
        </Box>
    )
}

export default ExerciseModal