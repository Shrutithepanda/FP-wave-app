import React from 'react'
import { LineWave } from 'react-loader-spinner'

// const Loader = ({style, ...props}) => {
/**
 * 
 * @returns a `LineWave` loading spinner
 */
const Loader = ({style, show = true, ...props}) => {
    
    return (
        <div>
            <LineWave 
                height = {120} 
                width = {120} 
                color = 'slateblue'
                // visible = {show}
                wrapperStyle = {style}
                ariaLabel = 'Loading'
                {... props}
            />

        </div>

    )
}

export default Loader