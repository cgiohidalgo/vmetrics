import React, { useState } from "react";
import { createBrowserHistory } from "history";
import { Router, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin.js";
import Login from "views/Login";
import { AppContext } from "context/AppContext";
import { PublicRoute } from "./router/PublicRoute";
import { PrivateRoute } from "./router/PrivateRoute";
import { checkLoggedUser } from "utils/checkLoggedUser";

const hist = createBrowserHistory();

export const App = () => {
  const [user, setUser] = useState(checkLoggedUser());

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <Router history={hist}>
        <Switch>
          <PublicRoute
            path="/login"
            isAuthenticated={user.logged}
            component={(props) => <Login {...props} />}
          />
          <PrivateRoute
            path="/"
            isAuthenticated={user.logged}
            component={(props) => <AdminLayout {...props} />}
          />
          {/* TODO:  */}

          {/* <Route path="/login" render={(props) => <LoginTest {...props} />} /> */}
          <Redirect to="/admin" />
        </Switch>
      </Router>
    </AppContext.Provider>
  );
};
