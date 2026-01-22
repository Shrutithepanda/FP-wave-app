import { createContext, useContext, useEffect, useRef, useState } from "react";

const EmotionContext = createContext()

const EmotionProvider = ({children}) => {
    const [camOn, setCamOn] = useState(false)
    const [emotions, setEmotions] = useState([{}])
    const [stressed, setStressed] = useState(false)
    const webcamRef = useRef(null)
    const captureIntervalRef = useRef(null)

    const captureAndDetectEmotions = async () => {
        if (!webcamRef.current) {
            return
        }

        const imageSource = webcamRef.current.getScreenshot() 
        if(!imageSource) {
            return
        }
        // Convert the image to base 64
        const b64Image = imageSource.replace(/^data:image\/jpeg;base64,/, "");
        console.log(b64Image)

        // try {
        //     // Get APIs response from the image sent
        //     const emotionApiResponse = await fetch("/emotion_detection_api", {
        //         method: "POST",
        //         headers: {"Content-Type": "application/json"},
        //         body: JSON.stringify({image: b64Image})
        //     })

        //     const data = await emotionApiResponse.json()
        //     const emotionsDetected = data.emotions // Extract the emotions object

        //     setEmotions(emotionsDetected) // Assign the emotions state the object received

        //     // console.log(emotionsDetected) 
        //     // setEmotions(data)
            
        // } catch (error) {
        //     console.log("Emotion detection failed: ", error)
        // }
    
    }
    
    const startCapturing = () => {
        setCamOn(true)
    }

    const stopCapturing = () => {
        setCamOn(false)
        clearInterval(captureIntervalRef.current)
    }

    const calculateStress = () => {
        const negative_emotions = ['SAD', 'DISGUSTED', 'CONFUSED', 'ANGRY', 'FEAR']
        const confidence = emotions[0].Confidence
        const type = emotions[0].Type
        
        negative_emotions.forEach((emotion, index) => {
            if (confidence > 30 && type === emotion) 
            {  
                setStressed(true)
            }
        
        })
    
        return () => setStressed(false)
    }

    useEffect(() => {
        if(camOn) {
            // When start is pressed capture photo every 5 seconds and get response from API
            captureIntervalRef.current = setInterval(captureAndDetectEmotions, 5000)

            return () => clearInterval(captureIntervalRef.current)
        }

    }, [])

    const videoConstraints = {
        width: 200,
        height: 180,
        facingMode: "user",
    } 

    return (
        <EmotionContext.Provider
            value = {{webcamRef, stressed, camOn, videoConstraints, startCapturing, stopCapturing, calculateStress, }}
        >
            {children}
        </EmotionContext.Provider>
    )
}

export default EmotionProvider

export const useEmotion = () => useContext(EmotionContext)