import React, { use, useEffect, useState } from 'react'
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { ArrowClockwise, Trash3 } from 'react-bootstrap-icons'
import { Box, Checkbox, IconButton, List } from '@mui/material'

import useApi from '../hooks/useApi'
import { useAuth } from '../hooks/AuthProvider'
import { useEmotion } from '../hooks/EmotionProvider'

import { TASK_API_URLS } from '../services/api.urls'
import { EMPTY_TABS } from '../constants/empty_tabs'
import Task from './Task'
import { Colours } from '../constants/colours'

const Tasks = () => {
  const navigate = useNavigate()
  const [taskData, setTaskData] = useState([{}])

  const [selectedTasks, setSelectedTasks] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(false)

  const { openSidebar } = useOutletContext(true)
  const { type } = useParams()

  const { user } = useAuth()
  const { stressed } = useEmotion()

  const getProjectsService = useApi(TASK_API_URLS.getProjects)

  useEffect(() => {
    getProjectsService.call({}, type, user.id)
  }, [type, refresh])

  const location = useLocation()

  useEffect(() => {
  //     fetch("/tasks")
  //     .then(
  //         response => response.json()
  //     )
  //     .then(
  //         data => {
  //             setTaskData(data)
  //         }
  //     )
    // console.log(type)
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <Box>
      <Box
        style = {
          openSidebar 
            ? {
              marginLeft: 158, 
              marginRight: 30,
              width: "calc(100% - 188px)",  // -158 px for sidebar's width + space for shadow, marginLeft prev. -> 150
              height: "calc(100vh - 70px)", // -70px for header's height,
              boxShadow: `2px 0px 10px 2px ${stressed ? "hsl(297, 67%, 80%)" : Colours.normalShadow}`, 
              transition: 'box-shadow 0.5s ease-in',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              background: "#F9F9F9",
            } 
            : {
              marginLeft: 30, 
              marginRight: 30,
              width: "calc(100% - 60px)", 
              height: "calc(100vh - 70px)",
              boxShadow: `2px 0px 10px 2px ${stressed ? "hsl(297, 67%, 80%)" : Colours.normalShadow}`, 
              transition: 'box-shadow 0.5s ease-in',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              background: "#F9F9F9"
            }
        }
      >
        <Box style = {{padding: "20px 10px 0 10px", display: "flex", alignItems: "center"}} >
          <Checkbox size = "small" 
          // onChange = {(e) => selectAllEmails(e)} 
          />
          <IconButton size = "small" 
          // onClick = {() => deleteSelectedEmails()}
          >
            <Trash3 color = "black" />
          </IconButton>
          <span style = {{marginLeft: "auto", marginRight: 20}}>
            <IconButton size = "small" onClick = {handleRefresh} >
              <ArrowClockwise color = "black" />
            </IconButton>
          </span>
          </Box>

          <List>
            {getProjectsService?.response?.map((project, index) => (
              <Task
                key = {index} 
                project = {project} 
                type = {type}
                selectedTasks = {selectedTasks}
                setSelectedTasks = {setSelectedTasks}
                setRefresh = {setRefresh}
              />
            ))}
          </List>
      </Box>
    </Box>
    // <div>
    //   {/* <AppHeader /> */}
    //   {/* Show loading if data is not fetched or is currently fetching, otherwise show data */}
    //   {(typeof taskData === 'undefined') 
    //   ? (
    //     <p>Loading...</p>
    //   ) 
    //   : (
    //       taskData.map((task, index) => (
    //         <div key = {index} className = 'Container-items'>
    //           <p style={{fontWeight: 'bold'}} >{task.title}</p>
    //           <p>{task.body}</p>
    //           <p style = {{border: '1px solid gray', width: '130px', borderRadius: '5px', textAlign: 'center'}} >{task.tags}</p>
    //         </div>
    //       ))
    //   )}
    // </div>
  )
}

export default Tasks