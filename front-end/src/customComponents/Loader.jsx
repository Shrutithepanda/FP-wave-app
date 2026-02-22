import React from 'react'
import { Box } from '@mui/material'
import { LineWave } from 'react-loader-spinner'
import { Colours } from '../constants/colours'

/**
 * 
 * @returns a `LineWave` loader from react-loader-spinner
 */
const Loader = () => {
    
    return (
        <Box sx = {{ margin: "auto auto" }}>
            <LineWave 
                height = {120} 
                width = {120} 
                color = {Colours.primary}
                ariaLabel = 'Loading'
            />
        </Box>

    )
}

export default Loader