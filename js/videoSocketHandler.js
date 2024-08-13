const initMediaStream = async () =>
  await navigator.mediaDevices.getUserMedia({ video: true });

const mediaStream = await initMediaStream();

function handleServerRes(data) {
  console.log("Processed data from server:", data);
}

async function setupWebSocket(sessionId, element) {
  let mediaRecorder;
  let ws;

  ws = new WebSocket(
    `wss://ai-personal-trainer.onrender.com/ws/session/${sessionId}/`,
  );

  closeConnection(element, ws);

  await new Promise((resolve, reject) => {
    ws.onopen = () => {
      console.log("Connection opened.");
      mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          ws.send(event.data);
        }
      };
      mediaRecorder.start(100);
      resolve();
    };
    ws.onerror = (error) => {
      console.error("WebSocket Error: ", error);
      reject();
    };
  });

  ws.onmessage = (e) => {
    const receivedData = JSON.parse(e.data);
    console.log("Message from server:", receivedData);
    switch (receivedData.type) {
      case "server_response":
        handleServerRes(receivedData.data);
        break;
      case "error":
        console.error("Server error:", receivedData.message);
        break;
      default:
        console.log("Unknown message type:", receivedData.type);
    }
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  };
}

export async function setupForm(form, uuid, end) {
  form.onsubmit = async (e) => {
    e.preventDefault();
    console.log("uuid2 :", uuid.value);
    await setupWebSocket(uuid.value, end);
  };
}

export async function setupVideo(element) {
  try {
    element.srcObject = mediaStream;
  } catch (e) {
    console.error("Error setting up video: ", e);
  }
}

export function setupLogin(element) {
  element.innerHTML = "Login";
  element.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}

function sendJsonDataToServer(data, socket) {
  if (socket.readyState === WebSocket.OPEN) {
    const message = {
      type: "client_data",
      data: data,
    };
    socket.send(JSON.stringify(message));
  } else {
    console.error("WebSocket is not open. ReadyState:", socket.readyState);
  }
}

function handleServerResponse(data, element) {
  console.log("Processed data from server:", data);
  element.innerHTML = `message: ${data["result"]}`;
}

async function setupJsonWebSocket(sessionId, data, p, end) {
  const ws = new WebSocket(
    `wss://ai-personal-trainer.onrender.com/ws/json_session/${sessionId}/`,
  );
  closeConnection(end, ws);

  // Wait for the connection to open
  await new Promise((resolve, reject) => {
    ws.onopen = () => {
      console.log("Connection opened.");
      resolve();
    };
    ws.onerror = (error) => {
      console.log("WebSocket Error: ", error);
      reject(error);
    };
  });

  // Send data once connection is open
  sendJsonDataToServer(data, ws);

  // Set up message handler
  ws.onmessage = (e) => {
    try {
      const receivedData = JSON.parse(e.data);
      console.log("Message from server:", receivedData);
    } catch (e) {
      console.log(
        `some errors jsut accoured with data recived from server ${e}`,
      );
    }
  };

  // Set up close handler
  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };
}

function closeConnection(element, socket) {
  element.innerHTML = "End Connection";
  element.onclick = () => {
    if (socket) {
      socket.close();
    }
  };
}

export let setupJsonForm = async (form, session, name, age, paragraph, end) => {
  form.onsubmit = async (e) => {
    e.preventDefault();
    const data = { name: name.value, age: age.value };
    console.log("uuid2 :", session.value);
    try {
      paragraph.innerHTML = "";
      await setupJsonWebSocket(session.value, data, paragraph, end);
      console.log("WebSocket setup completed successfully");
    } catch (e) {
      console.error("Error setting up WebSocket:", e);
    }
  };
};

export const setupForward = (element) => {
  element.innerHTML = "Try other way";
  element.addEventListener("click", () => {
    console.log("clicked");
    console.log(Window);
    document.location.assign("html/frame2.html");
  });
};
