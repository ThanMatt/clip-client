import { createTheme, type ThemeOptions } from "@mui/material";

const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#3fb59f",
    },
    secondary: {
      main: "#f50057",
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: "Montserrat",
        },
      },
    },
  },
  typography: {
    fontFamily: "Montserrat",
  },
};

export const theme = createTheme(themeOptions);
