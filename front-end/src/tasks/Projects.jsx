import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { ArrowClockwise, Trash3 } from 'react-bootstrap-icons'
import { Box, Checkbox, IconButton, List } from '@mui/material'

import Task from './Project'
import NoContent from '../customComponents/NoContent'
import Loader from '../customComponents/Loader'

import useApi from '../hooks/useApi'
import { useAuth } from '../hooks/AuthProvider'
import { useEmotion } from '../hooks/EmotionProvider'

import { TASK_API_URLS } from '../services/api.urls'
import { EMPTY_TABS } from '../constants/empty_tabs'
import { Colours } from '../constants/colours'

const Projects = () => {
  const [selectedProjects, setSelectedProjects] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(false)

  const { openSidebar } = useOutletContext(true)
  const { type } = useParams()

  // User object and stressed state
  const { user } = useAuth()
  const { stressed } = useEmotion()

  // Initialise services
  const getProjectsService = useApi(TASK_API_URLS.getProjects)
  const deleteProjectsService = useApi(TASK_API_URLS.deleteProject)
  const moveProjectsToTrashService = useApi(TASK_API_URLS.moveProjectToTrash)

  useEffect(() => {
    /**
     * Get projects for the selected page type from the sidebar
     */
    const fetchData = async () => {
      setLoading(true)

      // Request only emails marked completed from the backend if type is "completed"
      if (type === "completed") await getProjectsService.call({}, "completed", user.id)

      // Request all projects from the backend where the type matches, body - empty for get request
      else await getProjectsService.call({}, type, user.id)

      setLoading(false)
    }
    fetchData()
  }, [type, refresh])

  /**
   * Check and uncheck all projects using the checkbox at the top
   * @param {*} e 
   */
  const selectAllProjects = (e) => {
    if (e.target.checked) {
      const projects = getProjectsService?.response?.map(project => project.id) || []
      setSelectedProjects(projects)
    }
    else {
      setSelectedProjects([])
    }
  }

  /**
   * Move selected projects to the trash folder or delete them from the database if selected page
   * type is Trash
   */
  const deleteSelectedProjects = () => {
    if (type === "trash") {
      // Delete from database and reload
      deleteProjectsService.call(selectedProjects)
      window.location.reload()
    }
    else {
      // Move emails to trash folder
      moveProjectsToTrashService.call(selectedProjects)
      setSelectedProjects([])
      window.location.reload()
    }
  }

  /**
   * Refresh page
   */
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
              width: "calc(100% - 188px)",  // -188 px for sidebar's width + space for shadow
              height: "calc(100vh - 70px)", // -70px for header's height,
              boxShadow: `2px 0px 10px 2px ${stressed ? "hsl(297, 67%, 80%)" : Colours.normalShadow}`, 
              transition: 'box-shadow 0.5s ease-in',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              background: Colours.background
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
              background: Colours.background
            }
        }
      >
        {/* Checkbox for selecting all emails, delete button and refresh button */}
        <Box style = {{ padding: "20px 10px 0 10px", display: "flex", alignItems: "center" }}>
          <Checkbox size = "small" onChange = { (e) => selectAllProjects(e) }/>

          <IconButton size = "small" onClick = { deleteSelectedProjects }>
            <Trash3 color = "#000" />
          </IconButton>

          <span style = {{ marginLeft: "auto", marginRight: 20 }}>
            <IconButton size = "small" onClick = { handleRefresh } >
              <ArrowClockwise color = "#000" />
            </IconButton>
          </span>
        </Box>

        {/* If response is being fetched, show the loader otherwise projects */}
        { loading 
          ? <Box sx = {{ margin: "auto auto", flexGrow: 1 }} >
              <Loader/> 
          </Box>
          : <List>
            { getProjectsService?.response?.map((project, index) => (
              <Task
                key = { index } 
                project = { project } 
                type = { type }
                selectedProjects = { selectedProjects }
                setSelectedProjects = { setSelectedProjects }
                setRefresh = { setRefresh }
              />
            ))}
          </List>
        }

        {/* Show message if no content is returned by the service */}
        {
          getProjectsService?.response?.length === 0 && 
            <NoContent
              message = {EMPTY_TABS[type]}
            />
        }
        
      </Box>
    </Box>
  )
}

export default Projects