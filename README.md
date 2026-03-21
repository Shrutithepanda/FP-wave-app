# Wave - an emotion-aware email and task manager
## UoL Final project, Interaction design, Template 11.2: Designing an Emotion-Aware Adaptive Email and Task Manager to Reduce Workplace Stress

Wave is an emotion-aware adaptive email and task manager app to help reduce workplace stress. It uses facial expressions to infer whether the user is stressed or not. Three stress levels are determined from facial expressions every few intervals - low, medium, or high. For each stress level different adaptations are made to the interface to help the user manage email overload or task prioritisation and in turn manage stress. Three adaptive features of the web app include: change in shadow colours of main and search bar container at each stress level, content restructuring at medium stress levels, and a take a break or try a breathing exercise prompt at high stress levels.


### Instructions to run the web app
- Clone the repository
- Use the command `npm install` in the back-end and front-end directories to install dependencies

#### To see the adaptive features using dummy emotion data
- Navigate to the back-end directory in the terminal and use the command `node server.js` to run the back-end
- Navigate to the front-end directory in a separate terminal and use the command `npm start` to run the front-end
- Turn on the Adaptive mode at the bottom of the sidebar to see the adaptive features

#### To see the adaptive features live through API response
- In the back-end directory create a .env file and paste the variables provided in submission area
- In the EmotionProvider file (front-end/src/hooks/EmotionProvider.jsx) comment out lines with the icon and number ➡️ 2 and ➡️ 3, and un-comment the line with icon and number ➡️ 1
- Navigate to the back-end directory in the terminal and use the command `node server.js` to run the back-end
- Navigate to the front-end directory in a separate terminal and use the command `npm start` to run the front-end
- Turn on the Adaptive mode at the bottom of the sidebar to see the adaptive features


**Note** <br>
Provide camera permissions after starting the app. <br>
The adaptive features - content restructuring only work on the Inbox page of the emails tab and the Projects page of the tasks tab, and breathing exercise suggestion works on Inbox and View email page of the emails tab and Projects and View project page of the tasks tab. For other pages in both tabs only change in shadow colour adaptive feature works.