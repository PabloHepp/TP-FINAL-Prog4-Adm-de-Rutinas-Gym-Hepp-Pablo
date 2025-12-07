import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>Administrador de Rutinas</main>
    </ThemeProvider>
  );
}

export default App;
