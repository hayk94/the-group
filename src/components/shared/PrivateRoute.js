import { Redirect, Route } from "react-router-dom";
import { getAccessTokenFromLocalStorage } from "../../helpers/authLocalStorage";
import React from "react";

const PrivateRoute = ({ children, ...rest }) => {
  const isAuthenticated = getAccessTokenFromLocalStorage();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
