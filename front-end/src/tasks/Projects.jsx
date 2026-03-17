import React, { Fragment, useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { ArrowClockwise, Trash3, X } from 'react-bootstrap-icons'
import { Box, Button, Checkbox, Fade, IconButton, List, Snackbar, Tooltip } from '@mui/material'

import Task from './Project'
import NoContent from '../customComponents/NoContent'
import Loader from '../customComponents/Loader'

import useApi from '../hooks/useApi'
import { useAuth } from '../hooks/AuthProvider'
import { useEmotion } from '../hooks/EmotionProvider'

import { TASK_API_URLS } from '../services/api.urls'
import { EMPTY_TABS } from '../constants/empty_tabs'
import { Colours } from '../constants/colours'
import ExerciseModal from '../customComponents/ExerciseModal'

const Projects = () => {
  const [selectedProjects, setSelectedProjects] = useState([])
  const [unimportantProjects, setUnimportantProjects] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(false)
  const [moved, setMoved] = useState(false)
  
  const [openSnackbarMed, setOpenSnackbarMed] = useState(false)
  const [openSnackbarHigh, setOpenSnackbarHigh] = useState(true)
  const [openExercise, setOpenExercise] = useState(false)
  
  const { openSidebar } = useOutletContext(true)
  const { type } = useParams()

  // User object and stress level
  const { user } = useAuth()
  const { stressLevel } = useEmotion()

  // Initialise services
  const getProjectsService = useApi(TASK_API_URLS.getProjects)
  const deleteProjectsService = useApi(TASK_API_URLS.deleteProject)
  const moveProjectsToTrashService = useApi(TASK_API_URLS.moveProjectToTrash)
  const getUnimportantProjectsService = useApi(TASK_API_URLS.getUnImportantProjects)
  const archiveProjectsService = useApi(TASK_API_URLS.archiveProjects)
  const unArchiveProjectsService = useApi(TASK_API_URLS.unArchiveProjects)

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

  useEffect(() => {
    /**
     * Fetch pojects not marked important
     */
    const fetchUnimportantProjects = async () => {
      const projects = await getUnimportantProjectsService.call({}, "", user.id)
      setUnimportantProjects(projects)
    }

    fetchUnimportantProjects()
  }, [])

  useEffect(() => {
    // If projects aren't moved to archives then call the restructure function (medium stress level)
    if (!moved) restructureProjects()
    
    // If stress level is high open the high stress snackbar
    if (stressLevel === "high") setOpenSnackbarHigh(true)

  }, [unimportantProjects, stressLevel])

  /**
   * Close the snackbar when X is pressed
   */
  const closeSnackbar = () => {
    setOpenSnackbarMed(false) 
    setOpenSnackbarHigh(false)
  }

  /**
   * Check and uncheck all projects using the checkbox at the top
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
      setRefresh((prev) => !prev)
    }
    else {
      // Move projects to trash folder
      moveProjectsToTrashService.call(selectedProjects)
      setSelectedProjects([])
      setRefresh((prev) => !prev)
    }
  }

  /**
   * Refresh page
   */
  const handleRefresh = () => {
    window.location.reload()
  }

  /**
   * Unarchive projects from the archives page when button is pressed
   */
  const unarchive = async () => {
    const projects = unimportantProjects?.map(project => project.id)
    await unArchiveProjectsService.call(projects)
    setRefresh((prev) => !prev)
  }

  /**
   * Move unimportant projects to the archives folder when stress level is medium. 
   * Bring projects back to projects folder when stress level is normal.
   */
  const restructureProjects = async () => {
    const projects = unimportantProjects?.map(project => project.id)

    if (unimportantProjects?.map(project => project.folder === "projects") && stressLevel === "medium") {
      await archiveProjectsService.call(projects)
      setOpenSnackbarMed(true)
      setMoved(true)
      setRefresh((prev) => !prev)
    }
    if (unimportantProjects?.map(project => project.folder === "archives") && stressLevel === "normal") {
      await unArchiveProjectsService.call(projects)
      setMoved(false)
    }
  }

  /**
   * Open breathing exercise modal and close the snackbar
   */
  const openBreathingExercise = () => {
    setOpenExercise(true)
    setOpenSnackbarHigh(false)
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
              // Adaptive shadow colours according to different stress levels
              boxShadow: `0px 0px 10px 2px ${
                stressLevel === "low" 
                ? Colours.lowStressShadow 
                : stressLevel === "medium"
                ? Colours.mediumStressShadow
                : stressLevel === "high" 
                ? Colours.highStressShadow
                : Colours.normalShadow
              }`, 
              transition: 'box-shadow 0.7s ease-in',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              background: Colours.container
            } 
            : {
              marginLeft: 30, 
              marginRight: 30,
              width: "calc(100% - 60px)", 
              height: "calc(100vh - 70px)",
              // Adaptive shadow colours according to different stress levels
              boxShadow: `0px 0px 10px 2px ${
                stressLevel === "low" 
                ? Colours.lowStressShadow 
                : stressLevel === "medium"
                ? Colours.mediumStressShadow
                : stressLevel === "high" 
                ? Colours.highStressShadow
                : Colours.normalShadow
              }`, 
              transition: 'box-shadow 0.7s ease-in',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              background: Colours.container
            }
        }
      >
        {/* Checkbox for selecting all emails, delete button and refresh button */}
        <Box style = {{ padding: "20px 10px 0 10px", display: "flex", alignItems: "center" }}>
          {/* Checkbox */}
          <Tooltip title = "Select all">
            <Checkbox 
              size = "small" 
              onChange = { (e) => selectAllProjects(e) }
              slotProps = {{
                input: { "aria-label": "select all checkbox" }
              }}
            />
          </Tooltip>

          {/* Delete button */}
          <Tooltip title = "Delete">
            <IconButton size = "small" onClick = { deleteSelectedProjects }>
              <Trash3 color = "#000" aria-label = "delete" />
            </IconButton>
          </Tooltip>

          {/* Move back button to show on the Archives page if there is content there */}
          { type === "archives" && getProjectsService?.response?.length
            ? <Button
              sx = {{ color: "#000", textTransform: "none", fontSize: 15 }}
              onClick = { unarchive }
            >
              Move back to Projects?
            </Button>
            : <></>
          }

          {/* Refresh */}
          <span style = {{ marginLeft: "auto", marginRight: 20 }}>
            <Tooltip title = "Refresh">
              <IconButton size = "small" onClick = { handleRefresh } >
                <ArrowClockwise color = "#000" aria-label = "refresh" />
              </IconButton>
            </Tooltip>
          </span>
        </Box>

        <main>
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
        </main>

        {/* Snackbars to show at medium and high stress levels */}
        { stressLevel === "medium"
          ? <Snackbar
            open = { openSnackbarMed }
            autoHideDuration = { 5000 }
            onClose = { closeSnackbar }
            slot = {{ transition: <Fade/> }}
            anchorOrigin = {{ vertical: 'bottom', horizontal: 'right' }}
            action = {
              <IconButton onClick = { closeSnackbar } aria-label = "close">
                <X color = "#FFF" aria-label = "close" />
              </IconButton>
            }
            message = "Un-important projects moved to the Archives folder."
          />
          : stressLevel === "high"
            ? <Snackbar
              open = { openSnackbarHigh }
              autoHideDuration = { 7000 }
              onClose = { closeSnackbar }
              slot = {{ transition: <Fade/> }}
              anchorOrigin = {{ vertical: "bottom", horizontal: "right" }}
              action = {
                <Fragment>
                  <Button 
                    sx = {{ textTransform: "none", fontSize: 14, color: Colours.selectedType }}
                    onClick = { openBreathingExercise }
                  >
                    Try a breathing exercise
                  </Button>
                  <IconButton onClick = { closeSnackbar } aria-label = "close">
                    <X color = "#FFF" aria-label = "close" />
                  </IconButton>
                </Fragment>
              }
              message = "High stress levels detected! Take a short break or"
            />
            : <></>
        }
        

        
      </Box>

      {/* Breathing exercise dialog */}
      <ExerciseModal 
        openExercise = { openExercise }
        setOpenExercise = { setOpenExercise }
      />
    </Box>
  )
}

export default Projects