import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { BrowserRouter as Router } from "react-router-dom";

import theme from "../theme";
import { AppComponent } from "./AppComponent";

const queryCache = new QueryCache();

const RootComponent = () => (
  <>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppComponent />
        </Router>
      </ThemeProvider>
      <ReactQueryDevtools />
    </ReactQueryCacheProvider>
  </>
);

export default RootComponent;
