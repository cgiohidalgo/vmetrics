import axios from "axios";
import { ENDPOINTS, getToken } from "../utils/general";

class ResourceService {
  getResources() {
    const url = ENDPOINTS.resource;
    return axios.get(url, getToken());
  }

  getResource(id) {
    const url = ENDPOINTS.resource + id;
    return axios.get(url, getToken());
  }

  getResourcesByProfessor(professorId) {
    const url = ENDPOINTS.resourceByProfessor + professorId;
    return axios.get(url, getToken());
  }

  createResource(resource) {
    const url = ENDPOINTS.resource;
    return axios.post(url, resource, getToken());
  }

  updateResource(resource) {
    const url = ENDPOINTS.resource + resource.id;
    return axios.put(url, resource, getToken());
  }

  deleteResource(id) {
    const url = ENDPOINTS.resource + id;
    return axios.delete(url, getToken());
  }
}

export default ResourceService;
