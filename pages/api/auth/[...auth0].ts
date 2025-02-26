import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";

const authHandler = handleAuth({
    login: handleLogin({
      returnTo: "/super-homepage",
    }),
    logout: handleLogout({
      returnTo: "/",
    }),
});

export default authHandler;
