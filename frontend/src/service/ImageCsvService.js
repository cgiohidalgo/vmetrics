import axios from "axios";
import { ENDPOINTS, getToken } from "../utils/general";

class ImageCsvService {
  getImage(id, number) {
    const url = ENDPOINTS.images + id + "/" + number + "/";
    return axios.get(url, getToken());
  }
}

export default ImageCsvService;
