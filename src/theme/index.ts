import * as React from 'react';
import { Components, ThemeOptions, createTheme } from '@mui/material/styles';

const MuiAppBar: Components['MuiAppBar'] = {
    styleOverrides: {
        root: {
            backgroundColor: 'white',
            color: 'black'
        }
    }
}

const MuiButtonBase: Components['MuiButtonBase'] = {
    styleOverrides: {
        root: {
            // backgroundColor: 'white',
            color: 'black'
        }
    }
}

const MuiButton: Components['MuiButton'] = {
    styleOverrides: {
        root: {
            // backgroundColor: 'white',
            color: 'black'
        }
    }
}
const config:ThemeOptions = {
    components: {
        MuiAppBar,
        // MuiButtonBase,
        // MuiButton,
    }
}
const theme = createTheme(config);
export default theme;