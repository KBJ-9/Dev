import React, { Component } from "react";
import {
  Container,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button
} from "@material-ui/core";
import LockOutLineIcon from "@material-ui/icons/LockOutlined";
import { compose } from "recompose";
import { consumerFirebase } from "../../server";
import { crearUsuario } from "../../sesion/actions/sesionAction";
import { openMensajePantalla } from "../../sesion/actions/snackbarAction";
import { StateContext } from "../../sesion/store";

const style = {
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: 8,
    backgroundColor: "#e53935"
  },
  form: {
    width: "100%",
    marginTop: 10
  },
  submit: {
    marginTop: 15,
    marginButton: 20
  }
};

const usuarioInicial = {
  nombre: "",
  apellido: "",
  email: "",
  password: ""
};

class registerUser extends Component {
  static contextType = StateContext;
  state = {
    firebase: null,
    usuario: {
      nombre: "",
      apellido: "",
      email: "",
      password: ""
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.firebase === prevState.firebase) {
      return null;
    }

    return {
      firebase: nextProps.firebase
    };
  }

  onChange = e => {
    let usuario = Object.assign({}, this.state.usuario);
    usuario[e.target.name] = e.target.value;
    this.setState({
      usuario: usuario
    });
  };
  registrar = async e => {
    e.preventDefault();
    const [{ sesion }, dispatch] = this.context;
    const { firebase, usuario } = this.state;

    let callback = await crearUsuario(dispatch, firebase, usuario);
    if (callback.status) {
      this.props.history.push("/");
    } else {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: callback.mensaje.message
      });
    }
  };

  render() {
    return (
      <Container maxWidth="md">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutLineIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Registre su cuenta
          </Typography>

          <form style={style.form}>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <TextField
                  name="nombre"
                  onChange={this.onChange}
                  value={this.state.usuario.nombre}
                  fullWidth
                  label="Ingrese su nombre "
                ></TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  name="apellido"
                  onChange={this.onChange}
                  value={this.state.usuario.apellido}
                  fullWidth
                  label="Ingrese su apellido "
                ></TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  name="email"
                  onChange={this.onChange}
                  value={this.state.usuario.email}
                  fullWidth
                  label="Ingrese su correo electronico "
                ></TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  type="password"
                  onChange={this.onChange}
                  value={this.state.usuario.password}
                  name="password"
                  fullWidth
                  label="Ingrese su contraseña "
                ></TextField>
              </Grid>
              <Grid container justify="center">
                <Grid item md={12} xs={6}>
                  <Button
                    type="submit"
                    onClick={this.registrar}
                    variant="contained"
                    fullWidth
                    size="large"
                    color="primary"
                    style={style.submit}
                  >
                    Registrar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default compose(consumerFirebase)(registerUser);
