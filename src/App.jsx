import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Home from "./pages/Home";
import { rootStyles } from "./themes/styles";
import theme from "./themes/theme";

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <div style={rootStyles}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </ThemeProvider>
        </div>
      </Router>
    </>
  );
}

export default App;
