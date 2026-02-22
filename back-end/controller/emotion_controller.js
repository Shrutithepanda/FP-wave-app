import Emotions from "../model/emotion.js"

/**
 * Call the AWS Rekognition API to detect emotion
 * @param {b64Image} req 
 * @param {object} res 
 * @returns an emotion object containing percentage of 8 core emotions
 * detected in the request image
 */
export const detectEmotions = async (req, res) => {
    try {
        // Get emotions from the detectEmotion function 
        // and send a 200 OK response along with the emotion object
        const emotion = await Emotions.detectEmotion(req.body.image)
        return res.status(200).json(emotion)

    } catch (error) {
        // Catch any error and send a 500 Internal server error 
        // along with the error message
        console.log("controller, detectEmotions: ", error.message)
        res.status(500).json(error.message)
    }
}