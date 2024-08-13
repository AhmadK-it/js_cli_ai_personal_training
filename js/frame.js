import "../css/frame.css";
import { setupForm } from "./poseSocketHandler.js";
document.querySelector("#main").innerHTML = `
  <div>
    <h1>Hello !</h1>
    <div class="container">
        <h1>WebSocket Frame Capture</h1>
        <form  id="sessionForm">
          <input  id="uuid" type="text" placeholder="enter the id"></input>
          <input a type="submit" value="connect"></input>
        </form>
        <button id="end"></button> # muset be removed
        <p id="status">Disconnected</p>
        <canvas id="frameDisplay" width="640" height="480"></canvas>
    </div>

 </div>
`;

setupForm(
  document.querySelector("#sessionForm"),
  document.querySelector("#uuid"),
  document.querySelector("#end"),
  document.querySelector("#frameDisplay"),
);
