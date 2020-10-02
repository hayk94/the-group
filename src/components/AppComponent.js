import React from "react";
import { Route, Switch } from "react-router-dom";

import { LOGIN_PATH, REGISTER_PATH } from "../routes";
import HomeView from "../views/HomeView/HomeView";
import LoginView from "../views/LoginView";
import RegisterView from "../views/RegisterView";
import PrivateRoute from "./shared/PrivateRoute";

export const AppComponent = () => {
  return (
    <Switch>
      <Route path={REGISTER_PATH}>
        <RegisterView />
      </Route>
      <Route path={LOGIN_PATH}>
        <LoginView />
      </Route>
      <PrivateRoute path="/">
        <HomeView />
      </PrivateRoute>
    </Switch>
  );
};
