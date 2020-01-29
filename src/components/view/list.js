import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, CardMedia, Card, CardContent, CardActions } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { consumerFirebase } from '../../server';
import logo from '../../logo.svg';

const style = {
    cardGrid: {
        paddingTop: 8,
        paddingBotton: 8
    },
    paper: {
        backgroundColor: "#f5f5f5",
        padding: "20px",
        minHeight: 650
    },
    link: {
        display: "flex"
    },
    gridTextField:{
        marginTop: "20px"
    },
    card:{
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    cardMedia:{
        paddingTop: "56.25%"
    },
    cardContent:{
        flexGrow: 1
    }
}

class list extends Component {

    state = {
        inmuebles: [],
        textoBusquedad: ""
    };

    cambiarBusquedaTexto = e =>{
        const self = this;
        self.setState({
            [e.target.name] : e.target.value
        })

        if(self.state.typingTimeout){
            clearTimeout(self.state.typingTimeout);
        }

        self.setState({
            name: e.target.value,
            typing: false,
            typingTimeout: setTimeout(goTime =>{
                let objectQuery = this.props.firebase.db
                .collection("Inmuebles")
                .orderBy("direccion")
                .where("keywords", "array-contains", self.state.textoBusquedad.toLowerCase());

                if(self.state.textoBusquedad.trim()===""){
                    objectQuery = this.props.firebase.db
                    .collection("Inmuebles")
                    .orderBy("direccion");
                }


                objectQuery.get().then(snapshot =>{
                    const arrayInmueble = snapshot.docs.map(doc =>{
                        let data = doc.data();
                        let id = doc.id;
                        return {id, ...data};
                    })
                    
                    console.log("data", arrayInmueble);
                    this.setState({
                        inmuebles: arrayInmueble
                    })
                })
            }, 500)
        })
    }

    async componentDidMount(){
        let objectQuery = this.props.firebase.db.collection("Inmuebles").orderBy("direccion");

        const snapshot = await objectQuery.get();
        
        const arrayInmueble = snapshot.docs.map(doc =>{
            let data = doc.data();
            let id =   doc.id;
            return{id,...data};
        }) 

        this.setState({
            inmuebles: arrayInmueble
        })
    }

    render() {
        return (
            <Container style={style.cardGrid}>
                <Paper style={style.paper}>
                    <Grid item xs={12} sm={12}>
                        <Breadcrumbs aria-label="breadcrumbs">
                            <Link color="inherit" style={style.link} href="/">
                                <HomeIcon/>
                                Home
                            </Link>
                            <Typography color="textPrimary">Mis Inmuebles</Typography>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={12} sm={6} style={style.gridTextField}>
                        <TextField
                            fullWidth
                            InputLabelProps = {{
                                shrink : true
                            }}
                            name="textoBusquedad"
                            variant="outlined"
                            label="Ingrese el mueble a buscar"
                            onChange={this.cambiarBusquedaTexto}
                            value={this.state.textoBusquedad}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} style={style.gridTextField}>
                            <Grid container spacing={4}>
                                {this.state.inmuebles.map(card =>(
                                    <Grid item key={card.id} xs={12} sm={6} md={4}>
                                        <Card style={style.card}>

                                            <CardMedia
                                                style={style.cardMedia}
                                                image={
                                                    card.fotos
                                                    ? card.fotos[0]
                                                        ? card.fotos[0]
                                                        : logo 
                                                    : logo
                                                }
                                                title="Mi Inmueble"
                                            />
                                            <CardContent style={style.cardContent}>
                                                    <Typography gutterBottom variant="h5" component="h2">
                                                        {card.ciudad + ", " + card.pais} 
                                                    </Typography>
                                            </CardContent>
                                                <CardActions>
                                                    <Button
                                                        size="small"
                                                        color="primary"
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        color="primary"
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </CardActions>

                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                    </Grid>
                </Paper>
            </Container>
        );
    }
}

export default consumerFirebase(list);