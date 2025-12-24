// const express = require('express');
// import express from "express";
// const app = express();
// import * as fs from "fs";
const port = process.env.PORT || 8000;

import express from "express";
import cors from "cors";
import { RekognitionClient, DetectFacesCommand } from "@aws-sdk/client-rekognition";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const aws_rekognition = new RekognitionClient({
  region: process.env.AWS_REGION || "us-east-1",
});

// console.log("AWS key loaded:", !!process.env.AWS_ACCESS_KEY_ID);

// app.post("/emotion_detection_json/:id", async (req, res) => { // alternative
app.post("/emotion_detection_api", async (req, res) => { // original
  // Getting AWS rekognition's response for emotions detected and sending to the front-end
  
  try {
    const buffer = Buffer.from(req.body.image, "base64");

    const command = new DetectFacesCommand({
      Image: { Bytes: buffer },
      Attributes: ["EMOTIONS"],
      // Attributes: ["ALL"],
    });

    const result = await aws_rekognition.send(command);
    const emotions = result.FaceDetails?.[0]?.Emotions || [];
    
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ emotions });

    // console.log(JSON.stringify(emotions, null, 2))
    
  } catch (err) {
    
    console.error(err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: "Emotion detection failed" });

  }

  // Alternative: Read values from the json file and send to front-end
  // const id = req.params.id
  // fs.readFile('emotion-data.json', function(err, data) { 
  //   if (err) throw err; 

  //   const emotions = JSON.parse(data);
  //   const emotionsArray = Array.isArray(emotions) ? emotions : Object.values(emotions);
  //   const emotion = emotionsArray.find(e => e.id === id);
  //   console.log('e:', emotion)

  //   if(emotion) {
  //     res.setHeader("Content-Type", "application/json");
  //     res.status(200).json(emotion);
  //   }
  //   else {
  //     res.status(400).json({error: "Emotion not found!"});
  //   }
  // });


  // console.log(data)
});

// Routes

// Email API
app.get('/emails', (req, res) => {
  // Hard coded dummy email data
  res.json([
    {title: "Mail item 1", body: "This is the body of the mail.", tags: "high priority"},
    {title: "Mail item 2", body: "This is the body of the mail. One more statement.", tags: "high priority"},
    {title: "Mail item 3", body: "This is the body of the mail.", tags: "low priority"},
    {title: "Mail item 4", body: "This is the body of the mail.", tags: "medium priority"},
    {title: "Mail item 5", body: "This is the body of the mail. Bye!", tags: "low priority"},
  ]);
});

app.get('/tasks', (req, res) => {
  // Hard coded dummy task data
  res.json([
    {title: "Task item 1", body: "This is a description of the task.", tags: "high priority"},
    {title: "Task item 2", body: "This is a description of the task. More elaborated.", tags: "high priority"},
    {title: "Task item 3", body: "This is a description of the task.", tags: "low priority"},
    {title: "Task item 4", body: "This is a description of the task.", tags: "medium priority"},
    {title: "Task item 5", body: "This is a description of the task.", tags: "low priority"},
  ]);
});

// GET route for express server
app.get('/express_backend', (req, res) => {
  res.send({ express: 'Express server is connected to React front-end' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
