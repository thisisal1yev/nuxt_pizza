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
  ],

  icon: {
    mode: "svg",
    size: "16",
  },

  veeValidate: { autoImports: true },

  pinia: { storesDirs: ["./store/**"] },

  css: ["./assets/main.css", "vue3-toastify/dist/index.css"],

  fonts: {
    families: [{ name: "Nunito", provider: "google" }],
    experimental: {
      // Required for TailwindCSS v4. You can enable support for processing CSS variables for font family names. This may have a performance impact.
      processCSSVariables: true,
      // Defines whether to enable adding local fallbacks. Default is `false`.
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
