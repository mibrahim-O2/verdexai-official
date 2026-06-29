const config = {
  api: {
    getBaseUrl: () => {
      return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    },
  },
  endpoints: {
    contact: {
      submit: "/api/v1/contact",
    },
    auth: {
      login: "/api/v1/auth/login",
      signup: "/api/v1/auth/signup",
      forgotPassword: "/api/v1/auth/forgot-password",
    },
  },
};

export default config;