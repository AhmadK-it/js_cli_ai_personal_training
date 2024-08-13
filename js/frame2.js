import "../css/frame.css";
import { setupExerciseDetection } from "./poseSocketHandler2.js";

document.querySelector("#main").innerHTML = `
  <div class="container">
    <h1>Exercise Detection</h1>
    <form id="sessionForm">
      <input id="sessionInput" type="text" placeholder="Enter session ID (optional)">
      <button type="submit">Start Detection</button>
    </form>
    <button id="endButton">End Connection</button>
    <p>Connection Status: <span id="status">Disconnected</span></p>
    <p>Exercise State: <span id="exerciseState"></span></p>
    <p>Prediction: <span id="prediction"></span></p>
    <p>Confidence: <span id="confidence"></span></p>
    <canvas id="frameDisplay" width="640" height="480"></canvas>
  </div>
`;

setupExerciseDetection(
  document.querySelector("#sessionForm"),
  document.querySelector("#sessionInput"),
  document.querySelector("#endButton"),
);
