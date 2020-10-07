import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import background from "./background-sky.jpg";

const GlobalStyle = createGlobalStyle`
  ${reset}

  html {
    background-image: url(${background});
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-position: left bottom;
    height: 100%;
  }
  
  body {
    font-family: Helvetica, sans-serif;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
