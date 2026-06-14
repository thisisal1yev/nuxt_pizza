import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      title: "Nuxt Pizza - вкусней уже некуда",
      htmlAttrs: {
        lang: "ru",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [{ name: "description", content: "Nuxt Pizza" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/logo.png" }],
    },
  },

  modules: [
    "@nuxt/fonts",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@vueuse/motion/nuxt",
    "@vee-validate/nuxt",
    "nuxt-auth-utils",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@vite-pwa/nuxt",
  ],

  icon: {
    mode: "svg",
    size: "16",
  },

  colorMode: {
    classSuffix: "",
    preference: "light",
    fallback: "light",
    storageKey: "nuxt-pizza-color-mode",
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Nuxt Pizza",
      short_name: "Nuxt Pizza",
      description: "Nuxt Pizza — вкусней уже некуда",
      lang: "ru",
      theme_color: "#ff6900",
      background_color: "#f4f1ee",
    },
    pwaAssets: {
      preset: "minimal-2023",
      image: "public/logo.png",
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2}"],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
    },
  },

  veeValidate: { autoImports: true },

  pinia: { storesDirs: ["./store/**"] },

  css: ["~/assets/main.css", "vue3-toastify/dist/index.css"],

  fonts: {
    families: [{ name: "Nunito", provider: "google" }],
    experimental: {
      processCSSVariables: true,
      disableLocalFallbacks: true,
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
      },
    },
  },

  vite: { plugins: [tailwindcss()] },

  compatibilityDate: "2024-09-15",
});
