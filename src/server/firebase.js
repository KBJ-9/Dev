import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyA7aIl5vzYZGwPM5tpVPOy-6-FC3bLQ9Kw",
    authDomain: "home-41d64.firebaseapp.com",
    databaseURL: "https://home-41d64.firebaseio.com",
    projectId: "home-41d64",
    storageBucket: "home-41d64.appspot.com",
    messagingSenderId: "645023326799",
    appId: "1:645023326799:web:9a1fc8dfeb74d40316c03a",
    measurementId: "G-NNZDQV871S"
  };

class Firebase {
    
    constructor(){
        app.initializeApp(config);
        this.db = app.firestore();
        this.auth = app.auth();
        this.storage = app.storage();

        this.storage.ref().constructor.prototype.guardarDocumentos = function(documentos){
            var ref=this;
            return Promise.all(documentos.map(function(file){
                return ref.child(file.alias).put(file).then(snapshot =>{
                    return ref.child(file.alias).getDownloadURL();
                })
            }))
        }
    }

    estaIniciado() {
        return new Promise(resolve =>{
            this.auth.onAuthStateChanged(resolve)
        })
    }

    guardarDocumento = (nombreDocumento, documento )=> this.storage.ref().child(nombreDocumento).put(documento);

    devolverDocumento =(documentoUrl) => this.storage.ref().child(documentoUrl).getDownloadURL();

    guardarDocumentos = (documentos) => this.storage.ref().guardarDocumentos(documentos); 
}

export default Firebase;