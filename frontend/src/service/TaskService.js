import axios from "axios";
import { ENDPOINTS, getToken } from "../utils/general";

class TaskService {
  getTasks() {
    const url = ENDPOINTS.task;
    return axios.get(url, getToken());
  }

  getTask(id) {
    const url = ENDPOINTS.task + id;
    return axios.get(url, getToken());
  }

  getTasksByProfessor(professorId) {
    const url = ENDPOINTS.taskByProfessor + professorId;
    return axios.get(url, getToken());
  }

  getTaskByResource(resourceId) {
    const url = ENDPOINTS.taskByResource + resourceId;
    return axios.get(url, getToken());
  }

  createTask(task) {
    const url = ENDPOINTS.task;
    return axios.post(url, task, getToken());
  }

  updateTask(task) {
    const url = ENDPOINTS.task + task.id;
    return axios.put(url, task, getToken());
  }

  deleteTask(id) {
    const url = ENDPOINTS.task + id;
    return axios.delete(url, getToken());
  }
}

export default TaskService;
