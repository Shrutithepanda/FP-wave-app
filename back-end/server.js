// const express = require('express');
// import express from "express";
// const app = express();
// import * as fs from "fs";

import express from "express";
import cors from "cors";
import { RekognitionClient, DetectFacesCommand } from "@aws-sdk/client-rekognition";
// import "dotenv/config";
import dotenv from "dotenv";
import supabase from "../front-end/src/supabase/supabaseClient.js";
import routes from "./routes/route.js";

dotenv.config()

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.json({ limit: "5mb" }));

// router for handling routes related to the email api 
app.use("/", routes)

const port = process.env.PORT;

const aws_rekognition = new RekognitionClient({
  // region: process.env.AWS_REGION || "us-east-1",
  region: process.env.AWS_REGION,
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
app.get('/inbox', async (_, res) => {
  // Get emails from supabase table
  try {
    const { data, error } = await supabase
    .from("Inbox")
    .select("*")

    return res.send(data)
    // console.log(data)

  } catch (error) {
      return res.send({ error })
  }
});

// Fetch mails from the emails table with the given id
// app.get("/emails/:id", async (req, res) => {
//   console.log(req.params)
//   // ⚠️ Implement using type to show in folders
//   try {
    // const { data, error } = await supabase
    // .from("Emails")
    // .select()
    // .eq("id", req.params.id)

    // return res.send(data)

//   } catch (error) {
//     return res.send({ error })
//   }
// })

// // Create a mail item in the Emails table (Sent tab)
// // app.post("/create_email", async (req, res) => {
// app.post("/emails/save", async (req, res) => {
//   try {
//     // console.log(req.body)
//     const { data, error } = await supabase
//     .from("Emails")
//     .insert(req.body)
  
//     if(error) return res.status(400).json(error)
//     res.status(200).json(req.body)

//   } catch (error) {
//     return res.send({ error })
//   }
// })

// // Delete a mail item from the Inbox table (Delete tab)
// app.delete("/emails/:id", async (req, res) => {
//   // ⚠️ Check how to delete multiple, from emails/inbox table
//   try {
//     const { data, error } = await supabase
//     .from("Inbox")
//     .delete()
//     .eq(":id", req.params.id)

//     // Refetch data without the deleted item
//     const { newData, newError } = await supabase
//     .from("Inbox")
//     .select("*")

//     if (error) return res.status(400).json(error)
//     return res.send(newData)

//   } catch (error) {
//     return res.send({ error })
//   }
// })

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
