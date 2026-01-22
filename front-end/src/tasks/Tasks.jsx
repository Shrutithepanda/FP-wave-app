import React, { useEffect, useState } from 'react'

import AppHeader from '../customComponents/AppHeader'

const Tasks = () => {
    const [taskData, setTaskData] = useState([{}])
    useEffect(() => {
        fetch("/tasks")
        .then(
            response => response.json()
        )
        .then(
            data => {
                setTaskData(data)
            }
        )

    }, [])

  return (
    <div>
      {/* <AppHeader /> */}
      {/* Show loading if data is not fetched or is currently fetching, otherwise show data */}
      {(typeof taskData === 'undefined') 
      ? (
        <p>Loading...</p>
      ) 
      : (
          taskData.map((task, index) => (
            <div key = {index} className = 'Container-items'>
              <p style={{fontWeight: 'bold'}} >{task.title}</p>
              <p>{task.body}</p>
              <p style = {{border: '1px solid gray', width: '130px', borderRadius: '5px', textAlign: 'center'}} >{task.tags}</p>
            </div>
          ))
      )}
    </div>
  )
}

export default Tasks