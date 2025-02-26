import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";

const authHandler = handleAuth({
    login: handleLogin({
      returnTo: "/user-homepage",
    }),
    logout: handleLogout({
      returnTo: "/",
    }),
});

export default authHandler;
