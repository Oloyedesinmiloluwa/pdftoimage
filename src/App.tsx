import React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";
import PdfConverter from "./components/PdfConverter";
import DrawerAppBar from "./components/Navbar";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <DrawerAppBar />
      <PdfConverter />
      </ThemeProvider>
    </div>
  );
}

export default App;
