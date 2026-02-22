import { RekognitionClient, DetectFacesCommand } from "@aws-sdk/client-rekognition";

// Initialise the client with the subcribed region
const aws_rekognition = new RekognitionClient({
    region: process.env.AWS_REGION,
})

/**
 * Model class that communicates with AWS Rekognition API to detect emotions in an image
 */
class Emotions {

    /**
     * Send request to AWS Rekognition API and get emotion data detected for the captured image
     * @param {b64Image} image
     * @returns emotions data object or error
     */
    static async detectEmotion (image) {
        try{
            // Encode the image to base64 format
            const buffer = Buffer.from(image, "base64");

            // Initialise the detect faces command to send to the API asking for the EMOTIONS object
            const command = new DetectFacesCommand({
                Image: { Bytes: buffer },
                Attributes: ["EMOTIONS"],
            })

            // Call the Rekognition API with the command
            const result = await aws_rekognition.send(command)

            // If the result is not empty return the emotions object otherwise return error
            if (result.FaceDetails && result.FaceDetails.length > 0) {
                // Extract the emotions object from the result
                const emotions = result.FaceDetails?.[0]?.Emotions || []
                // console.log(emotions)

                return emotions
            } 
            else {
                return error
            }

            // Dummy emotion data
            const dummyEmotion = [
                { Type: 'SAD', Confidence: 88.0078125 },
                { Type: 'CALM', Confidence: 7.861328125 },
                { Type: 'ANGRY', Confidence: 0.24509429931640625 },
                { Type: 'CONFUSED', Confidence: 0.15727677941322327 },
                { Type: 'FEAR', Confidence: 0.09136199951171875 },
                { Type: 'DISGUSTED', Confidence: 0.04062652587890625 },
                { Type: 'SURPRISED', Confidence: 0.005520880222320557 },
                { Type: 'HAPPY', Confidence: 0.0008801619405858219 }
            ]
            // return dummyEmotion

        } catch (error) {
            throw error
        }
    }
}

export default Emotions