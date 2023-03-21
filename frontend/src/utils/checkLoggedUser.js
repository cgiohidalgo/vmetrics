import jwtDecode from "jwt-decode";

export const checkLoggedUser = () => {
  if (window.localStorage.getItem("token-access")) {
    const { id, username, role, email, exp } = jwtDecode(
      window.localStorage.getItem("token-access")
    );

    if (Date.now() <= exp * 1000) {
      return {
        logged: true,
        id: id,
        username: username,
        role: role,
        email: email,
      };
    } else {
      return { logged: false };
    }
  } else {
    return {
      logged: false,
    };
  }
};
