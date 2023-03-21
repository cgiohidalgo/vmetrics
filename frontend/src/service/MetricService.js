import axios from "axios";
import { AppContext } from "../context/AppContext";
import { ENDPOINTS, getToken } from "../utils/general";

class MetricService {
  static contextType = AppContext;

  getMetricsByTask(taskId, params = {}) {
    const url = ENDPOINTS.metricByTask + taskId;
    return axios.get(url, getToken(params));
  }

  getEvaluatedMetrics(professorId) {
    const url = ENDPOINTS.evaluatedMetrics + professorId;
    return axios.get(url, getToken());
  }

  getMetricsByStudent(studentId) {
    const url = ENDPOINTS.metricByStudent + studentId;
    return axios.get(url, getToken());
  }

  getMetricByInputId(inputId, params = {}) {
    const url = ENDPOINTS.metricByInputCode + inputId;
    return axios.get(url, getToken(params));
  }

  generateMetricsByTask(taskId, language) {
    const url = ENDPOINTS.metricByTask + taskId + "/";
    return axios.post(url, language, getToken());
  }

  generateMetricsByStudent(taskId, language) {
    const url = ENDPOINTS.metricByStudent + taskId + "/";
    return axios.post(url, language, getToken());
  }

  generateMetricByInputId(inputId, language) {
    const url = ENDPOINTS.metricByInputCode + inputId + "/";
    return axios.get(url, { language: language }, getToken());
  }
}

export default MetricService;
