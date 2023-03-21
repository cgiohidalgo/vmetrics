import axios from "axios";
import { ENDPOINTS, getToken } from "../utils/general";

class GraphicService {
  getCourseTask(professorId) {
    const url = ENDPOINTS.courseTaskGraph + professorId;
    return axios.get(url, getToken());
  }

  getTotalResult(professorId) {
    const url = ENDPOINTS.totalResultGraph + professorId;
    return axios.get(url, getToken());
  }

  getTotalResultByCourses(professorId) {
    const url = ENDPOINTS.totalResultGraphByCourse + professorId;
    return axios.get(url, getToken());
  }

  getTaskFailed(professorId) {
    const url = ENDPOINTS.taskFailedGraph + professorId;
    return axios.get(url, getToken());
  }
}

export default GraphicService;
