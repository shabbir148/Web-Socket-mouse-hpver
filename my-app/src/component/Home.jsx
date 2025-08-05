import React from "react";
import useWebSocket from "react-use-websocket";
import { useEffect, useRef } from "react";
import throttle from "lodash.throttle";
import { Cursor } from "./Cursor";

export default function Home({ username }) {
  // WebSocket connection setup
  const wsUrl = "ws://localhost:8000";

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(wsUrl, {
    queryParams: { username: username },
    onOpen: () => console.log("WebSocket connection opened"),
    onClose: () => console.log("WebSocket connection closed"),
    onError: (error) => console.error("WebSocket error:", error),
  });
  const sendJsonMessageendThrottle = useRef(
    throttle((message) => {
      sendJsonMessage(message);
    }, 1000)
  );
  useEffect(() => {
    sendJsonMessage({ x: 0, y: 0 });
    window.addEventListener("mousemove", (event) => {
      const mousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      sendJsonMessageendThrottle.current(mousePosition);
    });
  }, []);

  const renderCursor = (users) => {
    console.log(users);
    return Object.values(users).map((user) => {
      return <Cursor point={[user.state.x, user.state.y]} key={user.username} />;
    });
  };
  if (lastJsonMessage) {
    return renderCursor(lastJsonMessage);
  }
  return (
    <div className="home">
      <h2>Welcome to the Home Page</h2>
      <p>This is the home page of your application.</p>
      <p>
        You can navigate to other pages using the links provided in the
        navigation bar.
      </p>
    </div>
  );
}
