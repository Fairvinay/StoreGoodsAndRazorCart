import React from "react";
import ReactDOM from "react-dom";
import "./styles/bootstrap.min.css";
import "./styles/index.css";
import App from "./App";
import InitLoader from "./InitLoader";
import { Provider } from "react-redux";
import store from "./store";
//  <InitLoader store={store} />
ReactDOM.render(
  <Provider store={store}>
    
    <App />
  </Provider>,
  document.getElementById("root")
);
