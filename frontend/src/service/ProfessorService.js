import axios from "axios";
import { ENDPOINTS, getToken } from "../utils/general";

class ProfessorService {
  getProfessor(id) {
    const url = ENDPOINTS.professor + id;
    return axios.get(url, getToken());
  }

  updateProfessor(professor, id) {
    const url = ENDPOINTS.professor + id + "/";
    return axios.put(url, professor, getToken());
  }

  createProfessor(professor) {
    const url = ENDPOINTS.professor;
    return axios.post(url, professor, getToken());
  }
}

export default ProfessorService;
