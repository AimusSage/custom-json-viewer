import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ReactDOM from "react-dom"
import App from "./app"

const theme = createTheme({
  palette: {
    mode: "light",
  },
})

const appElement = document.getElementById("app")
if (appElement) {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>,
    appElement,
  )
}
