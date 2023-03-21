import axios from "axios";
import { ENDPOINTS, getToken } from "../utils/general";

class FileService {
  sendFile(file) {
    const url = ENDPOINTS.file;
    return axios.post(url, file, getToken());
  }

  sendCsvFile(file) {
    const url = ENDPOINTS.csvfile;
    return axios.post(url, file, getToken());
  }
}

export default FileService;
