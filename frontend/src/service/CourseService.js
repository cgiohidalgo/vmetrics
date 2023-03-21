import axios from "axios";
import { AppContext } from "../context/AppContext";
import { ENDPOINTS, getToken } from "../utils/general";

class CourseService {
  static contextType = AppContext;

  getCourses() {
    const url = ENDPOINTS.course;
    return axios.get(url, getToken());
  }

  getCourse(id) {
    const url = ENDPOINTS.course + id;
    return axios.get(url, getToken());
  }

  createCourse(course) {
    const url = ENDPOINTS.course;
    return axios.post(url, course, getToken());
  }

  updateCourse(course) {
    const url = ENDPOINTS.course + course.id;
    return axios.put(url, course, getToken());
  }

  deleteCourse(id) {
    const url = ENDPOINTS.course + id;
    return axios.delete(url, getToken());
  }
}

export default CourseService;
