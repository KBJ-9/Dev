import React, { Component, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Snackbar } from "@material-ui/core"
import "./App.css";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import theme from "./theme/theme";
import list from "./components/view/list";
import AppNavbar from "./components/layout/AppNavbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import registerUser from "./components/security/registerUser";
import login from "./components/security/login";
import { FirebaseContext } from "./server";

import { useStateValue } from "./sesion/store";
import openSnackbarReducer from "./sesion/reducers/openSnackbarReducer";
import  RutaAutenticada  from "./components/security/authRoute";
import PerfilUsuario from "./components/security/PerfilUsuario";
import newList from "./components/view/newList";

function App(props) {
  let firebase = React.useContext(FirebaseContext);
  const [autenticationIniciada, setupFirebaseIncial] = React.useState(false);

  const [{ openSnackbar, sesion }, dispatch] = useStateValue();
  useEffect(() => {
    firebase.estaIniciado().then(val => {
      setupFirebaseIncial(val);
    });
  });

  return autenticationIniciada !== false ? (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar ? openSnackbar.open : false}
        autoHideDuration={3000}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={
          <span id="message-id">
            {openSnackbar ? openSnackbar.mensaje : ""}
          </span>
        }
        onClose={() =>
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: false,
              mensaje: ""
            }
          })
        }
      ></Snackbar>
      <Router>
        <MuiThemeProvider theme={theme}>
          <AppNavbar />

          <Grid container>
            <Switch>
              <RutaAutenticada exact path="/" autenticadoFirebase={firebase.auth.currentUser} component={list}/>
              <RutaAutenticada exact path="/login/perfil" autenticadoFirebase={firebase.auth.currentUser} component={PerfilUsuario}/>
              <RutaAutenticada exact path="/new/inmueble" autenticadoFirebase={firebase.auth.currentUser} component={newList}/>

              <Route path="/signup" exact component={registerUser}></Route>
              <Route path="/login" exact component={login}></Route>
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    </React.Fragment>
  ) : null;
}

export default App;
