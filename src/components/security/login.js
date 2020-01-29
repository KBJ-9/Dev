import React, { Component } from 'react';
import { Container, Avatar, Typography, TextField, Button } from '@material-ui/core';
import LockOutlineIcon from '@material-ui/icons/LockOutlined';
import { compose } from 'recompose';
import { consumerFirebase } from '../../server'; 
import { iniciarSesion } from '../../sesion/actions/sesionAction';
import { openMensajePantalla } from '../../sesion/actions/snackbarAction';

import { StateContext } from '../../sesion/store';

const style = {
    paper: {
        marginTop: 9,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar:{
        margin: 5,
        backgroundColor: "red"
    },

    from: {
        width: "100%",
        marginTop: 8
    }
    

}

class login extends Component {
    static contextType = StateContext;

    state = {
        firebase: null,
        usuario: {
            email: '',
            password: ''
        }
    };

    static getDerivedStateFromProps(nextProps, prevState){

        if(nextProps.firebase === prevState.firebase){
            return null;
        }

        return {
            firebase: nextProps.firebase
        }

    }

    onChange = e =>{
        let usuario = Object.assign({}, this.state.usuario);
        usuario[e.target.name] = e.target.value;
        this.setState({
            usuario : usuario
        })
    }

    Login = async e => {
        e.preventDefault();
        const [{sesion}, dispatch] = this.context;
        const {firebase, usuario} = this.state;
        const {email, password} = usuario;


        let callback = await iniciarSesion(dispatch, firebase, email, password);
        if(callback.status){
            this.props.history.push("/");
        }else{
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: callback.mensaje.message
            })
        }

    }

    render() {
        return (
                <Container maxWidth="xs">
                    <div style={style.paper}>
                        <Avatar style={style.avatar}>
                            <LockOutlineIcon></LockOutlineIcon>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Ingrese Usuario
                        </Typography>
                        <from style={style.from}>
                            <TextField
                            variant="outlined"
                            label="Correo electronico"
                            name="email"
                            fullWidth
                            margin="normal"
                            onChange={this.onChange}
                            value={this.state.usuario.email}
                            />
                            <TextField
                            variant="outlined"
                            label="Password"
                            type="password"
                            name="password"
                            fullWidth
                            margin="normal"
                            onChange={this.onChange}
                            value={this.state.usuario.password}
                            />
                            <Button 
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.Login}
                            >Enviar
                            </Button>
                        </from>
                    </div>
                </Container>
        );
    }
}

export default compose(consumerFirebase)(login);

