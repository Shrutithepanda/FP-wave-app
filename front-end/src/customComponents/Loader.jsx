import React from 'react'
import { Box } from '@mui/material'
import { LineWave } from 'react-loader-spinner'

// const Loader = ({style, ...props}) => {
/**
 * 
 * @returns a `LineWave` loader from react-loader-spinner
 */
const Loader = ({style, show = true, ...props}) => {
    
    return (
        // Render in the center of the scree/any component
        // <Box>
            <LineWave 
                height = {120} 
                width = {120} 
                color = 'slateblue'
                // visible = {show}
                // wrapperStyle = {style}
                ariaLabel = 'Loading'
                // {... props}
            />
        // </Box>

    )
}

export default Loader