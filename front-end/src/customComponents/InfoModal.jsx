import { Box, Dialog, IconButton, styled, Typography } from "@mui/material"
import { XLg } from 'react-bootstrap-icons'

import { Colours } from '../constants/colours'

// Styled MUI components
const dialogStyle = {
    height: 500,
    width: "70%",
    maxHeight: 500,
    maxWidth: "70%",
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: "100%",
    width: "90%",
    marginTop: 10,
})

// Content to show in the dialog
const content = {
    title: "Wave - An emotion aware adaptive email and task manager",
    description: `
        Wave is an emotion aware email and task manager app that detects your stress levels using your facial expressions
        and adapts to your stress levels. \n
        The app captures your facial expressions every few seconds and detects your current emotion. It temporarily keeps
        track of your emotions and based on that detects whether you are stressed or not, and what is the intensity of that
        stress - low, medium or high. When the app detects low stress levels the main container and the search bar container
        change their shadow colours 🪄. On medium stress levels your emails or projects marked important by you are moved to 
        the Archives folder. If you want to bring those back to the Inbox and Projects folder respectively, just go to the
        Archives folder and press "Move back to Inbox" or "Move back to Projects" button at the top. At high stress levels
        the app prompts you to take a break and if you are unable to take a break you can try a brething exercise for a few
        minutes to regulate your stress. If at any point you don't want the app to adapt and make changes or you don't 
        prefer the changes, just click the "Turn off?" button at the bottom of the sidebar. \n
        The app at any point, does not store you emotional or stress data in the database. It only temporarily keeps track
        of your emotions and after a few intervals the emotions are reset. \n
        Here's to stress-free working!🥂
    `
}

/**
 * 
 * @param {boolean} openInfo
 * @param {function} setOpenInfo 
 * @returns a dialog containing information about the app
 */
const InfoModal = ({ openInfo, setOpenInfo }) => {
    /**
     * Close the dialog
     */
    const closeDialog = (e) => {
        e.preventDefault() 
        setOpenInfo(false)
    }

    return (
        <Box>
            <Dialog
                open = {openInfo}
                PaperProps = {{ sx: dialogStyle }}
                onClose = { (e) => closeDialog(e) }
            >
                {/* Header containing dialog title and close button */}
               <Header>
                    <Typography>Info</Typography>
                    <IconButton onClick = { (e) => closeDialog(e) } >
                        <XLg size = {15} color = "#000" aria-label = "close info dialog" />
                    </IconButton>
               </Header>

                {/* If loading show the loader otherwise show the content */}
                <StyledText>
                    <Typography variant = "h5">{ content.title }</Typography>
                    <Typography variant = "body1" sx = {{ marginTop: 3 }}>{ content.description }</Typography>
                </StyledText>
                
            </Dialog>
        </Box>
    )
}

export default InfoModal