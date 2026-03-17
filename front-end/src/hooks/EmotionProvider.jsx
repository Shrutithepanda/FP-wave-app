import { createContext, useContext, useEffect, useRef, useState } from "react";
import useApi from "./useApi";
import { EMOTION_API_URLS } from "../services/api.urls";

// Create context
const EmotionContext = createContext()

/**
 * Create a context provider 
 * @returns capturing functions, stress state and stress levels
 */
const EmotionProvider = ({ children }) => {
    let videoRef = useRef(null)
    let canvasRef = useRef(null)
    const captureIntervalRef = useRef(null)
    
    let idRef = useRef(0)
    const [camOn, setCamOn] = useState(false)
    const [emotions, setEmotions] = useState([{}])
    const [emotionsInInterval, setEmotionsInInterval] = useState([])
    const [stressed, setStressed] = useState(false)
    const [stressLevel, setStressLevel] = useState("normal")

    // Initialise the emotion detection service
    const detectEmotionsService = useApi(EMOTION_API_URLS.detectEmotions)

    /**
     * Capture and image, send the image to the emotion detection API 
     * and set the emotions object to the response received
     * @returns detected emotion in the picture
     */
    const captureAndDetectEmotions = async () => {
        // source: https://github.com/PratikN7572/garbhsanskar-next-web-app/blob/a2dd6e085acd79124f01ebfeb3297b3cdd9d65f8/ui/Webcam.jsx
        if (videoRef.current && canvasRef.current) {
            // Set refs to current values
            const video = videoRef.current
            const canvas = canvasRef.current
            const context = canvas.getContext("2d")

            // Check if video is set up properly
            // console.log({
            //     readyState: video.readyState,
            //     width: video.videoWidth,
            //     height: video.videoHeight,
            // })

            // Set canvas dimensions
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            
            // Draw image on canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height)

            // Get image 
            const imageSource = canvas.toDataURL("image/jpeg")
            
            // Convert the image to base 64
            const b64Image = imageSource?.replace(/^data:image\/jpeg;base64,/, "")

            // Call the API with the image captured
            const result = await detectEmotionsService?.call({ image: b64Image })

            if (result) {
                // If result is not empty set emotions to the result
                setEmotions(result)
            } 
            else {
                // Otherwise log the error
                console.log("Error detecting emotions: ", detectEmotionsService?.error)
            }
        }

        // Clean up
        return () => setEmotions([{}])
    }
    
    /**
     * Start capturing and turn the camera on
     */
    const startCapturing = async () => {
        setCamOn(true)

        // source: https://github.com/PratikN7572/garbhsanskar-next-web-app/blob/a2dd6e085acd79124f01ebfeb3297b3cdd9d65f8/ui/Webcam.jsx
        // If media devices are available then set the video reference to the stream
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    let video = videoRef.current
                    video.srcObject = stream
                    // When video is loaded, play the video and catch any errors
                    video.onloadedmetadata = async () =>
                    {                    
                        await video.play()
                        .catch(error => {
                            if (error.name === "AbortError") {
                                console.log("Video play was interrupted:", error)
                            } else {
                                console.error("Error attempting to play video:", error)
                            }
                        })
                    }
                }
            })
            .catch(error => console.log("Error accessing the webcam: ", error))
        }
    }

    /**
     * Stop capturing and turn the camera off
     */
    const stopCapturing = () => {
        // Set the camera off and clear any intervals or refs
        setCamOn(false)
        clearInterval(captureIntervalRef.current)
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks()
            tracks.forEach((track) => track.stop())
        }
    }

    /**
     * Calculate stress from the emotion data received from the API
     */
    const calculateStress = () => {
        const negativeEmotions = ['SAD', 'DISGUSTED', 'CONFUSED', 'ANGRY', 'FEAR']

        // Primary emotion's type and confidence values
        const type = emotions[0]?.Type
        const confidence = emotions[0]?.Confidence

        // If type and confidence are not undefined, set emotions in interval to the current emotion
        if (type && confidence) {
            setEmotionsInInterval([{id: idRef.current++, Type: type, Confidence: confidence}, ...emotionsInInterval])
        }

        // If first 3 values emotions in interval has mostly negative emotions, set stressed to true and stressLevel to low
        if (emotionsInInterval.length == 3) {
            let negCount = 0
            emotionsInInterval.forEach((emotion) => {
                if (negativeEmotions.includes(emotion.Type)) negCount ++ 
            })
            if (negCount >= 2) {
                setStressed(true)
                setStressLevel("low")
            }
        }
        
        // If first 6 values emotions in interval has mostly negative emotions, set stressed to true and stressLevel to medium
        else if (emotionsInInterval.length == 6) {
            let negCount = 0
            emotionsInInterval.forEach((emotion) => {
                if (negativeEmotions.includes(emotion.Type)) negCount ++ 
            })
            if (negCount >= 4) {
                setStressed(true)
                setStressLevel("medium")
            }
        }

        // If first 9 values emotions in interval has mostly negative emotions, set stressed to true and stressLevel to high
        else if (emotionsInInterval.length == 9) {
            let negCount = 0
            emotionsInInterval.forEach((emotion) => {
                if (negativeEmotions.includes(emotion.Type)) negCount ++ 
            })
            if (negCount >= 5) {
                setStressed(true)
                setStressLevel("high")
            }
            else if (negCount < 5) {
                setStressed(false)
                setStressLevel("normal")
            }
        }
        
        // Clean up. If length of the array is greater than 9, set values back to their initial values
        if (emotionsInInterval.length >= 9) {
            setEmotionsInInterval([])
            idRef.current = 0
        }
    }

    useEffect(() => {
        // Ideally after permission is granted, camera will start capturing on load
        // startCapturing()

        // Capture and detect emotion through API call very 5 seconds
        if (camOn) {
            // Un-comment this line to capture and request the API to detect emotions
            // captureIntervalRef.current = setInterval(captureAndDetectEmotions, 5000)
        }
        return () => clearInterval(captureIntervalRef.current)

    }, [camOn])

    useEffect(() => {
        // If the emotions object contain more than an empty array, [{...}]
        if (emotions?.length > 1) {
            calculateStress()
        }
    }, [emotions])

    useEffect(() => {
        // Un-comment this line to see the current emotion and stress levels on the console
        // console.log(`${emotions[0]?.Type}`)
    }, [emotions])

    useEffect(() => {
        // console.log(`Emotion: ${emotions[0]?.Type}, \nLen: ${emotionsInInterval.length} \nStress level: ${stressLevel}`)
    }, [emotions, emotionsInInterval, stressed])

    // ================ Code to detect stress from hard-coded emotions object every 5 seconds ================
    // Current list in the dummy data
    const [currentEmotion, setCurrentEmotion] = useState([])
    // Current index
    const [index, setIndex] = useState(0)
    // Dummy emotions data object - 9 arrays
    const dummyEmotionData = [
        [
            { Type: "DISGUSTED", Confidence: 99.34895324707031 },
            { Type: "CALM", Confidence: 0.1007080078125 },
            { Type: "HAPPY", Confidence: 0.04298686981201172 },
            { Type: "SURPRISED", Confidence: 0.007383525371551514 },
            { Type: "ANGRY", Confidence: 0.005424022674560547 },
            { Type: "CONFUSED", Confidence: 0.005284945480525494 },
            { Type: "SAD", Confidence: 0.0010132789611816406 },
            { Type: "FEAR", Confidence: 0.00026226043701171875 },
        ],
        [
            { Type: "CALM", Confidence: 96.86104583740234 },
            { Type: "SAD", Confidence: 1.174163818359375 },
            { Type: "ANGRY", Confidence: 0.6744384765625 },
            { Type: "CONFUSED", Confidence: 0.14837583899497986 },
            { Type: "DISGUSTED", Confidence: 0.06127357482910156 },
            { Type: "FEAR", Confidence: 0.056171417236328125 },
            { Type: "SURPRISED", Confidence: 0.013008713722229004 },
            { Type: "HAPPY", Confidence: 0.0022550425492227077 },
        ],
        [
            { Type: "ANGRY", Confidence: 76.953125 },
            { Type: "SAD", Confidence: 17.1630859375 },
            { Type: "DISGUSTED", Confidence: 2.56195068359375 },
            { Type: "CONFUSED", Confidence: 1.6009012460708618 },
            { Type: "CALM", Confidence: 1.324462890625 },
            { Type: "FEAR", Confidence: 0.03676414489746094 },
            { Type: "SURPRISED", Confidence: 0.0008493661880493164 },
            { Type: "HAPPY", Confidence: 0.00012715658522211015 },
        ],
        [
            { Type: "FEAR", Confidence: 43.30171203613281 },
            { Type: "ANGRY", Confidence: 28.564453125 },
            { Type: "SAD", Confidence: 11.224365234375 },
            { Type: "CONFUSED", Confidence: 1.57928466796875 },
            { Type: "DISGUSTED", Confidence: 0.884246826171875 },
            { Type: "CALM", Confidence: 0.2422332763671875 },
            { Type: "SURPRISED", Confidence: 0.017061829566955566 },
            { Type: "HAPPY", Confidence: 0.0018378099193796515 },
        ],
        [
            { Type: 'SAD', Confidence: 88.0078125 },
            { Type: 'CALM', Confidence: 7.861328125 },
            { Type: 'ANGRY', Confidence: 0.24509429931640625 },
            { Type: 'CONFUSED', Confidence: 0.15727677941322327 },
            { Type: 'FEAR', Confidence: 0.09136199951171875 },
            { Type: 'DISGUSTED', Confidence: 0.04062652587890625 },
            { Type: 'SURPRISED', Confidence: 0.005520880222320557 },
            { Type: 'HAPPY', Confidence: 0.0008801619405858219 }
        ],
        [
            { Type: "CONFUSED", Confidence: 51.949222564697266 },
            { Type: "SAD", Confidence: 8.477783203125 },
            { Type: "ANGRY", Confidence: 7.568359375 },
            { Type: "CALM", Confidence: 5.7881669998168945 },
            { Type: "DISGUSTED", Confidence: 3.7322998046875 },
            { Type: "FEAR", Confidence: 0.141143798828125 },
            { Type: "SURPRISED", Confidence: 0.046640634536743164 },
            { Type: "HAPPY", Confidence: 0.017468135803937912 },
        ],
        [
            { Type : "HAPPY", Confidence: 52.44140625 },
            { Type : "CALM", Confidence: 15.5322265625 },
            { Type : "CONFUSED", Confidence: 14.9677734375 },
            { Type : "SAD", Confidence: 5.133056640625 },
            { Type : "ANGRY", Confidence: 3.5003662109375 },
            { Type : "DISGUSTED", Confidence: 2.41546630859375 },
            { Type : "SURPRISED", Confidence: 1.4715194702148438 },
            { Type : "FEAR", Confidence: 0.008980432525277138 },
            
        ],
        [
            { Type: "CALM", Confidence: 90.86216735839844 },
            { Type: "SAD", Confidence: 3.1219482421875 },
            { Type: "ANGRY", Confidence: 2.5787353515625 },
            { Type: "CONFUSED", Confidence: 0.2770423889160156 },
            { Type: "FEAR", Confidence: 0.13408660888671875 },
            { Type: "DISGUSTED", Confidence: 0.11091232299804688 },
            { Type: "SURPRISED", Confidence: 0.015601515769958496 },
            { Type: "HAPPY", Confidence: 0.0013510386925190687 },
        ],
        [
            { Type: "SURPRISED", Confidence: 51.949222564697266 },
            { Type: "SAD", Confidence: 8.477783203125 },
            { Type: "ANGRY", Confidence: 7.568359375 },
            { Type: "CONFUSED", Confidence: 5.7881669998168945 },
            { Type: "DISGUSTED", Confidence: 3.7322998046875 },
            { Type: "FEAR", Confidence: 0.141143798828125 },
            { Type: "CALM", Confidence: 0.046640634536743164 },
            { Type: "HAPPY", Confidence: 0.017468135803937912 },
        ],
    ]

    // Every 5 seconds, read the list at current index
    useEffect(() => {
        // Un-comment out these lines to read current information from dummy emotion data
        if (camOn) {
            const interval = setInterval(() => {
                setCurrentEmotion(dummyEmotionData[index])
                setIndex((prevIndex) => (prevIndex + 1) % dummyEmotionData.length)
            }, 3000)

            return () => clearInterval(interval)
        }
    }, [camOn, index])

    // Detect stress from the current emotion list
    useEffect(() => {
        /**
         * Sets stress levels to low, medium or high depending on whether most of the values
         * in the array, emotionsInInterval, which contains the current emotion in each interval,
         * are negative
         */
        const calculateDummyStress = () => {
            const negativeEmotions = ['SAD', 'DISGUSTED', 'CONFUSED', 'ANGRY', 'FEAR']

            // Primary emotion's type and confidence values
            const type = currentEmotion[0]?.Type
            const confidence = currentEmotion[0]?.Confidence

            // If type and confidence are not undefined, set emotions in interval to the current emotion
            if (type && confidence) setEmotionsInInterval([{id: idRef.current++, Type: type, Confidence: confidence}, ...emotionsInInterval])

            // If first 3 values emotions in interval has mostly negative emotions, set stressed to true and stressLevel to low
            if (emotionsInInterval.length == 3) {
                let negCount = 0
                emotionsInInterval.forEach((emotion) => {
                    if (negativeEmotions.includes(emotion.Type)) negCount ++ 
                })
                if (negCount >= 2) {
                    setStressed(true)
                    setStressLevel("low")
                }
            }
            
            // If first 6 values emotions in interval has mostly negative emotions, set stressed to true and stressLevel to medium
            else if (emotionsInInterval.length == 6) {
                let negCount = 0
                emotionsInInterval.forEach((emotion) => {
                    if (negativeEmotions.includes(emotion.Type)) negCount ++ 
                })
                if (negCount >= 4) {
                    setStressed(true)
                    setStressLevel("medium")
                }
            }

            // If first 9 values emotions in interval has mostly negative emotions, set stressed to true and stressLevel to high
            else if (emotionsInInterval.length == 9) {
                let negCount = 0
                emotionsInInterval.forEach((emotion) => {
                    if (negativeEmotions.includes(emotion.Type)) negCount ++ 
                })
                if (negCount >= 5) {
                    setStressed(true)
                    setStressLevel("high")
                }
                else if (negCount < 5) {
                    setStressed(false)
                    setStressLevel("normal")
                }
            }
            
            // Clean up. If length of the array is greater than 9, set values back to their initial values
            if (emotionsInInterval.length >= 9) {
                setEmotionsInInterval([])
                idRef.current = 0
            }
        }
        
        // Un-comment this line to calculate stress on dummy data
        calculateDummyStress()
    }, [currentEmotion]) // if current emotion stays the same this won't change

    useEffect(() => {
        // console.log("array:", emotionsInInterval)
        // console.log("Stress level:", stressLevel)
    }, [emotionsInInterval, stressLevel])
    
    return (
        <EmotionContext.Provider
            value = {{ camOn, stressed, stressLevel, startCapturing, stopCapturing, setStressed, setStressLevel }}
        >
            { children }
            {/* Render video and canvas outside the screen */}
            <video 
                ref = {videoRef} 
                style = {{
                    position: "absolute", 
                    top: "-9999px", left: "-9999px", opacity: 0, 
                    width: "100%", height: "100%", 
                    objectFit: "contain"
                }} 
            />
            <canvas 
                ref = {canvasRef} 
                style = {{
                    position: "absolute", 
                    top: "-9999px", left: "-9999px", 
                    opacity: 0
                }} 
            />
        </EmotionContext.Provider>
    )
}

export default EmotionProvider

// Hook
export const useEmotion = () => useContext(EmotionContext)