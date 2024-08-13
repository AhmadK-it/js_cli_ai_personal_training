let socket;
let isCapturing = false;

const captureFrame = (frameDisplay, ctx) => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = () => {
          ctx.drawImage(video, 0, 0, frameDisplay.width, frameDisplay.height);

          stream.getTracks().forEach((track) => track.stop());

          frameDisplay.toBlob((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(new Uint8Array(reader.result));
            reader.readAsArrayBuffer(blob);
          }, "image/jpeg");
        };
      })
      .catch((error) => reject(error));
  });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectToServer = async (session, frameDisplay, ctx) => {
  const serverUrl = `wss://d2fe-46-58-147-98.ngrok-free.app/ws/pose_session/${session}/`;
  // const serverUrl = `ws://localhost:8001/ws/pose_session/${session}/`;
  // const serverUrl = `wss://ai-personal-trainer.onrender.com/ws/pose_session/${session}/`;
  socket = new WebSocket(serverUrl);

  socket.onopen = async () => {
    document.getElementById("status").textContent = "Connected";
    isCapturing = true;

    while (isCapturing) {
      try {
        const frameBuffer = await captureFrame();

        socket.send(
          JSON.stringify({
            frame: btoa(String.fromCharCode.apply(null, frameBuffer)),
          }),
        );

        await sleep(100);
      } catch (error) {
        console.error("Error capturing frame:", error);
      }
    }
  };

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log("Received from server:", response);
  };

  socket.onclose = () => {
    document.getElementById("status").textContent = "Disconnected";
    isCapturing = false;
    ctx.clearRect(0, 0, frameDisplay.width, frameDisplay.height);
  };
};

export const setupForm = async (form, session, end, frame) => {
  const ctx = frame.getContext("2d");
  form.onsubmit = async (e) => {
    e.preventDefault();
    console.log("uuid2 :", session.value);
    setupEndSessionBtn(end);
    await setupWebSocket(session.value, frame, ctx);
  };
};

const setupEndSessionBtn = (element) => {
  element.innerHTML = "End Connection";
  element.onclick = () => {
    if (socket) {
      socket.close();
    }
  };
};

const setupWebSocket = async (sessionId, frame, ctx) => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    await connectToServer(sessionId, frame, ctx);
  } else {
    console.log("other errors");
  }
};
