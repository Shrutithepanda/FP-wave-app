import React, { useState, useRef, useEffect, Webcam } from 'react'
import './Emotions.css'

const Emotions = () => {
  // states and refs
  const [camOn, setCamOn] = useState(false)
  const [emotions, setEmotions] = useState([{}])
  const [stressed, setStressed] = useState(false)
  const webcamRef = useRef(null)
  const captureIntervalRef = useRef(null)

  useEffect(() => {
    if(camOn) {
      // When start is pressed capture photo every 5 seconds and get response from API
      captureIntervalRef.current = setInterval(captureAndDetectEmotions, 5000)

      return () => clearInterval(captureIntervalRef.current)
    }
  })

  async function captureAndDetectEmotions() {
    if (!webcamRef.current) {
      return
    }

    const imageSource = webcamRef.current.getScreenshot() 
    if(!imageSource) {
      return
    }
    // Convert the image to base 64
    const b64Image = imageSource.replace(/^data:image\/jpeg;base64,/, "");

    try {
      // Get APIs response from the image sent
      const emotionApiResponse = await fetch("/emotion_detection_api", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({image: b64Image})
      })

      const data = await emotionApiResponse.json()
      const emotionsDetected = data.emotions // Extract the emotions object

      setEmotions(emotionsDetected) // Assign the emotions state the object received

      // console.log(emotionsDetected) 
      // setEmotions(data)
      
    } catch (error) {
      console.log("Emotion detection failed: ", error)
    }
    
  }

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
  
  function startCapturing() {
    setCamOn(true)
  }

  function stopCapturing() {
    setCamOn(false)
    clearInterval(captureIntervalRef.current)
  }

  useEffect(() => {
    const confidence = emotions[0].Confidence
    const type = emotions[0].Type
    // if (camOn) {
      // console.log(emotions[0].Confidence) // by default the emotion with the highest value is at the top
      const negative_emotions = ['SAD', 'DISGUSTED', 'CONFUSED', 'ANGRY', 'FEAR']
      // const negative_emotions = ['CALM', 'SAD', 'DISGUSTED', 'CONFUSED', 'ANGRY', 'FEAR']
      // console.log(Object.values(negative_emotions))
      
      negative_emotions.forEach((emotion, index) => {
        if (confidence > 30 && type === emotion) 
        {  
          setStressed(true)
          // console.log(emotion)
        }
        
      })
    // }

    return () => setStressed(false)
  })

  const videoConstraints = {
    width: 200,
    height: 180,
    facingMode: "user",
  } 
  return (
    <div>
      <div className = 'Camera'> 
        <Webcam 
          ref = {webcamRef}
          audio = {false}
          screenshotFormat = 'image/jpeg'
          videoConstraints = {videoConstraints}
          mirrored = {true}
        />
        </div>
        <div>
          {/* Start and stop capturing buttons */}
          {!camOn 
            ? (
              <button onClick = {startCapturing} className = 'Capture-btn' style = {{border: '1px solid green', backgroundColor: '#4fda7bff'}}>
                Start Capturing
              </button>
            ) : (
              <button onClick = {stopCapturing} className = 'Capture-btn' style = {{border: '1px solid red', backgroundColor: '#f46161ff'}}>
                Stop Capturing
              </button>

            )
          }
        </div>

        <div>
          {/* When getting response from API */}
          {emotions?.length > 0 
            ? (
              <div>
                {/* Print the emotion whose confidence level is > 40% */}
                {emotions.map((emotion, index) => (
                  <div key = {index}>
                      {emotion.Confidence > 20.0 
                      ? <p>{emotion.Type}: {emotion.Confidence?.toFixed(3)}% </p>
                      : <p></p>
                      }
                  </div>
                ))}
              </div>
            )
            : (
              <p>Not detected</p>
          )}

          {/* Alternative code */}
          {/* <button onClick={startFetching}>Start</button>
          <button onClick={stopFetching}>Stop</button>
          {emotions.length > 0 ? (
            <div>
              {emotions.map((emotion, index) => (
                <p key={index}>
                  {emotion.id}: {emotion.Type} - {emotion.Confidence?.toFixed(3)}%
                </p>
              ))}
            </div>
          ) : (
            <p>No emotion data available.</p>
          )} */}
        </div>
    </div>
  )
}

// export const stressed = stressed
export default Emotions