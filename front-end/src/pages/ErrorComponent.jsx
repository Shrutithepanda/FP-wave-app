import { Box, Typography } from "@mui/material"
import { useRouteError } from "react-router-dom"

/**
 * 
 * @returns Message to show when there is an error
 */
const ErrorComponent = () => {
    const error = useRouteError()
    console.log(error)

    return (
        <Box style = {{marginLeft: 150}} >
            <Typography>
                Error loading page.
            </Typography>
        </Box>
    )
}

export default ErrorComponent