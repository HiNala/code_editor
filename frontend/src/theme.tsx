import { createSystem, defaultConfig } from "@chakra-ui/react"
import { buttonRecipe } from "./theme/button.recipe"

export const system = createSystem(defaultConfig, {
  globalCss: {
    html: {
      fontSize: "16px",
      height: "100%",
      // Use dynamic viewport height for better mobile/desktop compatibility
      minHeight: "100vh",
      "@supports (height: 100dvh)": {
        minHeight: "100dvh",
      },
    },
    body: {
      fontSize: "0.875rem",
      margin: 0,
      padding: 0,
      height: "100%",
      // Prevent content from being hidden behind browser UI
      minHeight: "100vh",
      "@supports (height: 100dvh)": {
        minHeight: "100dvh",
      },
    },
    "#root": {
      height: "100%",
      minHeight: "100vh",
      "@supports (height: 100dvh)": {
        minHeight: "100dvh",
      },
    },
    ".main-link": {
      color: "ui.main",
      fontWeight: "bold",
    },
  },
  theme: {
    tokens: {
      colors: {
        ui: {
          main: { value: "#6366F1" },
        },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
})
