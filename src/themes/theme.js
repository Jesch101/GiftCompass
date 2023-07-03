import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    text: {
      primary: "#ffffff",
    },
    background: {
      default: "#333333",
    },
    primary: {
      main: "#ffcc66",
    },
    secondary: {
      main: "#dbdbdb",
    },
    accent: {
      main: "#545454",
    },
  },
  typography: {
    allVariants: {
      color: "#ffffff",
    },
  },
});

export default theme;
