import React from "react";
import theme from "./theme";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LOGIN_PATH, REGISTER_PATH } from "./routes";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path={REGISTER_PATH}>
            <RegisterView />
          </Route>
          <Route path={LOGIN_PATH}>
            <LoginView />
          </Route>
          <Route path="/">Hello</Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
