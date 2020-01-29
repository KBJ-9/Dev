import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette: {
        primary: {
            main: '#89cff0'
        },
        comon: {
            white: 'white'
        },

        secondary: {
            main: '#899cf0'
        }
    },
    spacing: 10
}); 

export default theme;