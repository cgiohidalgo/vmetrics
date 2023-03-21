import axios from "axios";
import { ENDPOINTS } from "../utils/general";

class AuthService {
  login(credentials) {
    const url = ENDPOINTS.login;
    return axios.post(url, credentials);
  }

  refresh(refreshToken) {
    const url = ENDPOINTS.loginRefresh;
    return axios.post(url, refreshToken);
  }

  logout(refreshToken) {
    const url = ENDPOINTS.logout;
    return axios.post(url, refreshToken);
  }
}

export default AuthService;
