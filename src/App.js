import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { LOGIN_PATH, REGISTER_PATH } from "./routes";
import theme from "./theme";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";

const queryCache = new QueryCache();

function App() {
  return (
    <>
      <ReactQueryCacheProvider queryCache={queryCache}>
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
      </ReactQueryCacheProvider>
      <ReactQueryDevtools />
    </>
  );
}

export default App;
