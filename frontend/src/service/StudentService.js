import axios from "axios";
import { ENDPOINTS, getToken } from "../utils/general";

class StudentService {
  getStudents() {
    const url = ENDPOINTS.student;
    return axios.get(url, getToken());
  }

  getStudent(id) {
    const url = ENDPOINTS.student + id;
    return axios.get(url, getToken());
  }

  getStudentsByProfessor(professorId) {
    const url = ENDPOINTS.studentByProfessor + professorId;
    return axios.get(url, getToken());
  }

  getStudentByResource(resourceId) {
    const url = ENDPOINTS.studentByResource + resourceId;
    return axios.get(url, getToken());
  }

  createStudent(student) {
    const url = ENDPOINTS.student;
    return axios.post(url, student, getToken());
  }

  updateStudent(student) {
    const url = ENDPOINTS.student + student.id;
    return axios.put(url, student, getToken());
  }

  deleteStudent(id) {
    const url = ENDPOINTS.student + id;
    return axios.delete(url, getToken());
  }
}

export default StudentService;
