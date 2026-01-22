import { Box, Typography } from "@mui/material"
import { useRouteError } from "react-router-dom"

const ErrorComponent = () => {
    const error = useRouteError()
    console.log("Error component: ", error)

    return (
        <Box style = {{marginLeft: 150}} >
            <Typography>
                Error loading page.
            </Typography>
        </Box>
    )
}

export default ErrorComponent