import { useState } from "react";
import React from "react";
import LoginForm from "./component/Login";
import Home from "./component/Home";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  console.log(username);

  return (
    <>
     
      {!username ? (
        <LoginForm onSubmit={setUsername} />
      ) : (
        <Home username={username} />
      )}

    </>
  );
}

export default App;
