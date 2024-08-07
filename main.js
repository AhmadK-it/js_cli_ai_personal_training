import "./style.css";
import { setupVideo, setupForm, setupLogin, setupJsonForm } from "./counter.js";

document.querySelector("#app").innerHTML = `
  <div>
    <h1>Hello !</h1>
    <div>
      <video id="video" autoplay></video>
    </div>
    <form  id="sessionForm">
      <input  id="uuid" type="text" placeholder="enter the id"></input>
      <input  type="submit" value="connect"></input>
    </form>
    <div class="card">
      <button id="stop" type="button"></button>
      <button id="login" type="button"></button>
    </div>
    <section class="form">
      <form id="Jsonform" action="/submit" method="POST">
          <label for="json_id">session id:</label>
          <input  id="json_id" type="text" placeholder="enter the id"></input>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="enter name">
          <br><br>
          <label for="age">Age:</label>
          <input type="number" id="age" name="age">
          <br><br>
          <input type="submit" value="Submit">
      </form>
      <button id="end" type="button"></button>
      <p id="out"></p>
    </section>
  </div>
`;

setupVideo(document.getElementById("video"));
setupForm(
  document.querySelector("#sessionForm"),
  document.querySelector("#uuid"),
  document.querySelector("#stop"),
);
setupLogin(document.querySelector("#login"));
setupJsonForm(
  document.querySelector("#Jsonform"),
  document.querySelector("#json_id"),
  document.querySelector("#name"),
  document.querySelector("#age"),
  document.querySelector("#out"),
  document.querySelector("#end"),
);
