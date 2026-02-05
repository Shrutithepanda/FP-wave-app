import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react' 
import { Routes, Route, Outlet, useParams, useLocation } from "react-router-dom"
import supabase from '../supabase/supabaseClient'
import { useAuth } from '../hooks/AuthProvider'

import Webcam from "react-webcam" 
import './App.css'

import HomePage from '../pages/HomePage'
import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import ProtectedRoutes from '../pages/ProtectedRoutes'

import Emails from '../emails/Emails'
import Tasks from '../tasks/Tasks'
import AuthProvider from '../hooks/AuthProvider'
import Container from 'react-bootstrap/esm/Container'
import AppHeader from '../customComponents/AppHeader'
import SideBar from '../customComponents/Sidebar'
import Loader from '../customComponents/Loader'
import { Box } from '@mui/material'
import { useEmotion } from '../hooks/EmotionProvider'
// import { stressed } from '../emotions/Emotions'

// T3
const WebcamImage = () => {
  // const [img, setImg] = useState(null)
  // const webcamRef = useRef(null)
  
  // T3
  // const capture = useCallback(() => {
  //   const imageSrc = webcamRef.current.getScreenshot() 
  //   setImg(imageSrc) 
  // }, [webcamRef]) 

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const imageSrc = webcamRef.current.getScreenshot() 
  //     setImg(imageSrc) 
  //     // API's work - detect emotion
  //   }, 5000)
    
  //   return () => {
  //     clearInterval(interval)
  //     console.log(img)
  //     setImg(null)
  //   }
  // }, [img])


  // return (

  //   // T3
  //   <div className="Container">
  //     {/* {img === null ? ( */}
  //       <>
  //         <Webcam
  //           audio={false}
  //           mirrored={true}
  //           height={300}
  //           width={300}
  //           ref={webcamRef}
  //           screenshotFormat="image/jpeg"
  //           videoConstraints={videoConstraints}
  //         />
  //         <button onClick={capture}>Capture</button>
  //       </>
  //     {/* ) : (
  //       <>
  //         <img src={img} alt="screenshot" />
  //         <button onClick={() => setImg(null)}>Retake</button>
  //       </>
  //     )} */}
  //   </div>
  // ) 
}

// T2
const App = () => {
  const { user, session } = useAuth()
  // console.log(user)

  // const [showEmails, setShowEmails] = useState(true) 
  // const [showTasks, setShowTasks] = useState(false) 

  // // Function for switching between emails and tasks tab
  // function showTab(tab) {
  //   if(tab === "email") {
  //     setShowEmails(true)
  //     setShowTasks(false)
  //   }
  //   else {
  //     setShowEmails(false)
  //     setShowTasks(true)
  //   }
  // }

  // Capturing and detecting emotions

  // states and refs
  // const [camOn, setCamOn] = useState(false)
  // const [emotions, setEmotions] = useState([{}])
  // const [stressed, setStressed] = useState(false)
  // const webcamRef = useRef(null)
  // const captureIntervalRef = useRef(null)

  // useEffect(() => {
  //   if(camOn) {
  //     // When start is pressed capture photo every 5 seconds and get response from API
  //     captureIntervalRef.current = setInterval(captureAndDetectEmotions, 5000)

  //     return () => clearInterval(captureIntervalRef.current)
  //   }
  // })

  // async function captureAndDetectEmotions() {
  //   if (!webcamRef.current) {
  //     return
  //   }

  //   const imageSource = webcamRef.current.getScreenshot() 
  //   if(!imageSource) {
  //     return
  //   }
  //   // Convert the image to base 64
  //   const b64Image = imageSource.replace(/^data:image\/jpeg;base64,/, "");

  //   try {
  //     // Get APIs response from the image sent
  //     const emotionApiResponse = await fetch("/emotion_detection_api", {
  //       method: "POST",
  //       headers: {"Content-Type": "application/json"},
  //       body: JSON.stringify({image: b64Image})
  //     })

  //     const data = await emotionApiResponse.json()
  //     const emotionsDetected = data.emotions // Extract the emotions object

  //     setEmotions(emotionsDetected) // Assign the emotions state the object received

  //     // console.log(emotionsDetected) 
  //     // setEmotions(data)
      
  //   } catch (error) {
  //     console.log("Emotion detection failed: ", error)
  //   }
    
  // }

  // Get response from json file every 5 seconds -> not working ideally
  // const [isFetching, setIsFetching] = useState(false);
  // const [currentId, setCurrentId] = useState(1);

  // useEffect(() => {
  //   let interval;

  //   const fetchEmotionData = async () => {
  //     try {
  //       const response = await fetch(`/emotion-data.json`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch emotion data");
  //       }
  //       const data = await response.json();
        
  //       const emotionsArray = Array.isArray(data) ? data : Object.values(data);
  //       // Find the data for the current ID
  //       const emotion = emotionsArray.find((item) => item[0].id === currentId);
        
  //       if (emotion) {
  //         setEmotions((prev) => [...prev, emotion]);
  //       }

  //       console.log(emotions)

  //       // Update the ID, wrapping around if necessary
  //       const nextId = currentId + 1 > data.length ? 1 : currentId + 1;
  //       setCurrentId(nextId);
  //     } catch (error) {
  //       console.error("Error fetching emotion data:", error);
  //     }
  //   };

  //   if (isFetching) {
  //     interval = setInterval(fetchEmotionData, 5000);
  //   }

  //   return () => clearInterval(interval);
  // }, [isFetching, currentId]);

  // const startFetching = () => setIsFetching(true);
  // const stopFetching = () => setIsFetching(false);

  // Original
  
  // function startCapturing() {
  //   setCamOn(true)
  // }

  // function stopCapturing() {
  //   setCamOn(false)
  //   clearInterval(captureIntervalRef.current)
  // }

  // useEffect(() => {
  //   const confidence = emotions[0].Confidence
  //   const type = emotions[0].Type
  //   // if (camOn) {
  //     // console.log(emotions[0].Confidence) // by default the emotion with the highest value is at the top
  //     const negative_emotions = ['SAD', 'DISGUSTED', 'CONFUSED', 'ANGRY', 'FEAR']
  //     // const negative_emotions = ['CALM', 'SAD', 'DISGUSTED', 'CONFUSED', 'ANGRY', 'FEAR']
  //     // console.log(Object.values(negative_emotions))
      
  //     negative_emotions.forEach((emotion, index) => {
  //       if (confidence > 30 && type === emotion) 
  //       {  
  //         setStressed(true)
  //         // console.log(emotion)
  //       }
        
  //     })
  //   // }

  //   return () => setStressed(false)
  // })

  // const videoConstraints = {
  //   width: 200,
  //   height: 180,
  //   facingMode: "user",
  // } 

  // Sidebar logic
  const [openSidebar, setOpenSidebar] = useState(true)  
  const toggleSidebar = () => setOpenSidebar(prevState => !prevState)

  // const { webcamRef, videoConstraints, videoRef } = useEmotion()
  const { stressed, camOn } = useEmotion()

  // Use location to see if to return emails or tasks pages
  // const location = useLocation()
  // useEffect(() => {
  //   console.log(location.pathname)
  // }, [])
  return(
    // <BrowserRouter>
    
    <Box>
      <AppHeader toggleSidebar = {toggleSidebar} />
      {/* <AppHeader toggleSidebar = {toggleSidebar} shadowColor = {stressed ? "lightgreen" : "#F5F5F5"} /> */}
      
      <Box>
        <SideBar openSidebar = {openSidebar} />
        {/* <SideBar openSidebar = {openSidebar} shadowColor = {stressed ? "lightgreen" : "#F5F5F5"} /> */}
        {/* Render all the children of the route wrapped in Suspense (because they are lazy loaded in the router.jsx file) */}
        <Suspense fallback = {<Loader/>} >
          <Outlet context = {{ openSidebar }} />
        </Suspense>
      </Box>
    </Box>

    // Before
    // <div className = "App">
    //   <title>Wave</title>

    //   {/* <WebcamImage /> */}
    //   <div className = 'Camera-emotion-container'>
    //     {/* <Emotions /> */}
    //     <div className = 'Camera'> 
        // <Webcam 
        //   ref = {webcamRef}
        //   audio = {false}
        //   screenshotFormat = 'image/jpeg'
        //   videoConstraints = {videoConstraints}
        //   // mirrored = {true}
        // />
    //     </div>
    //     <div>
    //       {!camOn 
    //         ? (
    //           <button onClick = {startCapturing} className = 'Capture-btn' style = {{border: '1px solid green', backgroundColor: '#4fda7bff'}}>
    //             Start Capturing
    //           </button>
    //         ) : (
    //           <button onClick = {stopCapturing} className = 'Capture-btn' style = {{border: '1px solid red', backgroundColor: '#f46161ff'}}>
    //             Stop Capturing
    //           </button>

    //         )
    //       }
    //     </div>

    //     <div>
    //       {emotions?.length > 0 
    //         ? (
    //           <div>
    //             {emotions.map((emotion, index) => (
    //               <div key = {index}>
    //                   {emotion.Confidence > 20.0 
    //                   ? <p>{emotion.Type}: {emotion.Confidence?.toFixed(3)}% </p>
    //                   : <p></p>
    //                   }
    //               </div>
    //             ))}
    //           </div>
    //         )
    //         : (
    //           <p>Not detected</p>
    //       )}
    //     </div>
    //   </div>

      // <header className = "App-header">
      //   {/* <Header /> */}
      //   <button className = {showEmails ? "Active-btn Change-tab-btns" : "Change-tab-btns"} onClick = {() => {showTab("email")}} >Emails</button>
      //   <button className = {showTasks ? "Active-btn Change-tab-btns" : "Change-tab-btns"} onClick = {() => {showTab("task")}} >Tasks</button>
      // </header>

    //   <div className = 'Content-container' 
    //     style = {{
    //       // HERE: problem accessing stressed. Cannot access 'stressed' before initialization
    //       // boxShadow: `1px 1px 15px 2px ${stressed ? 'green' : 'darkgrey'}`, transition: 'box-shadow 0.5s ease-in'
    //     }}
    //   >
    //     {/* Emails */}
    //     {showEmails
    //       ? <Emails />
    //       : <div></div>
    //     }

    //     {/* Tasks */}
    //     {showTasks
    //       ? <Tasks />
    //       : <div></div>
    //     }

    //   </div>
    // </div>
  )
}

export default App 
