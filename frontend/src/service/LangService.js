import axios from "axios";
import { ENDPOINTS, getToken } from "../utils/general";

class LangService {
  getLanguages = () => {
    const url = ENDPOINTS.language;
    return axios.get(url, getToken());
  };
}

export default LangService;
