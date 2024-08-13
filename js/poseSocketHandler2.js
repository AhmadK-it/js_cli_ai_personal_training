// Constants
// const API_ENDPOINT = 'https://ai-personal-trainer.onrender.com/stream/sessions/start/';
// const WS_BASE_URL = 'wss://ai-personal-trainer.onrender.com/ws/pose_session/';
const API_ENDPOINT = "http://localhost:8001/stream/sessions/start/";
const WS_BASE_URL = "ws://localhost:8001/ws/pose_session/";

// State variables
let socket = null;
let isCapturing = false;

// Utility functions
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const captureFrame = async (videoElement, canvasElement) => {
  const ctx = canvasElement.getContext("2d");
  ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  return canvasElement.toDataURL("image/jpeg", 0.8).split(",")[1];
};

// Main functionality
const startExerciseDetection = async (sessionId = null) => {
  const videoElement = document.createElement("video");
  const canvasElement = document.getElementById("frameDisplay");

  try {
    // Fetch session ID if not provided
    if (!sessionId) {
      const response = await fetch(API_ENDPOINT);
      const data = await response.json();
      sessionId = data.session_id;
    }

    // Set up WebSocket connection
    socket = new WebSocket(`${WS_BASE_URL}${sessionId}/`);

    socket.onopen = () => {
      console.log("WebSocket Connected");
      document.getElementById("status").textContent = "Connected";
      socket.send(JSON.stringify({ exercise_type: "shoulder_press" }));
      startVideoCapture(videoElement, canvasElement);
    };

    socket.onmessage = (event) => {
      console.log("message called");
      console.log(`message data: ${event.data}`);
      const data = JSON.parse(event.data);
      updateUI(data);
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
      document.getElementById("status").textContent = "Disconnected";
      isCapturing = false;
    };
  } catch (error) {
    console.error("Error:", error);
  }
};

const startVideoCapture = async (videoElement, canvasElement) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    await videoElement.play();
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    isCapturing = true;
    sendFrames(videoElement, canvasElement);
  } catch (error) {
    console.error("Error accessing webcam:", error);
  }
};

const sendFrames = async (videoElement, canvasElement) => {
  while (isCapturing && socket.readyState === WebSocket.OPEN) {
    const frame = await captureFrame(videoElement, canvasElement);
    socket.send(JSON.stringify({ frame }));
    await sleep(100);
  }
};

const updateUI = (data) => {
  if (data.state) {
    document.getElementById("exerciseState").textContent = data.state;
  }
  if (data.prediction) {
    document.getElementById("prediction").textContent = data.prediction;
    document.getElementById("confidence").textContent =
      data.confidence.toFixed(2);
  }
};

// Setup function (replaces the old setupForm function)
export const setupExerciseDetection = (form, sessionInput, endButton) => {
  form.onsubmit = async (e) => {
    e.preventDefault();
    const sessionId = sessionInput.value.trim();
    await startExerciseDetection(sessionId || null);
  };

  endButton.onclick = () => {
    if (socket) {
      socket.close();
    }
    isCapturing = false;
  };
};
