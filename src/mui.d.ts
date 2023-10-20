import '@mui/material/styles/createPalette';
declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    customBtnColor: PaletteColorOptions;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    customBtnColor: true;
  }
}
