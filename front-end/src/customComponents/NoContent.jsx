import { Box, Divider, styled, Typography } from "@mui/material"
import { Colours } from "../constants/colours"

const Component = styled(Box) ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 50,
    opacity: "0.8",
    width: "100%"
})

const StyledDivider = styled(Divider) ({
    width: "100%",
    marginTop: 10,
})

/**
 * 
 * @param {object} message 
 * @returns a component containing message to show when there is no content in the page
 */
const NoContent = ({ message }) => {
    return (
        <Component>
            <Typography>{message?.heading}</Typography>
            <Typography>{message?.subHeading}</Typography>
            <StyledDivider />
        </Component>
    )
}

export default NoContent