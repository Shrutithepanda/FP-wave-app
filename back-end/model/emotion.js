import { RekognitionClient, DetectFacesCommand } from "@aws-sdk/client-rekognition";

const aws_rekognition = new RekognitionClient({
    region: process.env.AWS_REGION,
})

class Emotions {

    /**
     * Send request to AWS Rekognition API and get emotion data from the captured image
     * @param {*} image
     * @returns emotion data object
     */
    static async detectEmotion (image) {
        try{
            const buffer = Buffer.from(image, "base64");

            const command = new DetectFacesCommand({
                Image: { Bytes: buffer },
                Attributes: ["EMOTIONS"],
            })

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

            // Call the Rekognition API
            const result = await aws_rekognition.send(command)
            if (result.FaceDetails && result.FaceDetails.length > 0) {
                const emotions = result.FaceDetails?.[0]?.Emotions || []
                // console.log(emotions)
                return emotions
            } else {
                return error
            }
        } catch (error) {
            throw error
        }
    }
}

export default Emotions