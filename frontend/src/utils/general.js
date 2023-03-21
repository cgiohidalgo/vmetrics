// data for <thead> of table in TableList view

const BASE_PATH = "http://localhost:8000";

const ENDPOINTS = {
  student: BASE_PATH + "/api/student/",
  studentByProfessor: BASE_PATH + "/api/professor/",
  studentByResource: BASE_PATH + "/api/resource/",
  professor: BASE_PATH + "/api/professor/",
  course: BASE_PATH + "/api/course/",
  resource: BASE_PATH + "/api/resource/",
  resourceByProfessor: BASE_PATH + "/api/resource/professor/",
  task: BASE_PATH + "/api/task/",
  taskByProfessor: BASE_PATH + "/api/task/professor/",
  taskByResource: BASE_PATH + "/api/task/resource/",
  input: BASE_PATH + "/api/input/",
  file: BASE_PATH + "/api/file/",
  csvfile: BASE_PATH + "/api/file/csv/",
  images: BASE_PATH + "/api/image/",
  language: BASE_PATH + "/api/input/languages/get/",
  login: BASE_PATH + "/api/auth/login/",
  loginRefresh: BASE_PATH + "/api/auth/login/refresh/",
  logout: BASE_PATH + "/api/auth/logout/",
  metricByTask: BASE_PATH + "/api/input/metrics/task/",
  metricByStudent: BASE_PATH + "/api/input/metrics/student/",
  metricByInputCode: BASE_PATH + "/api/input/metrics/source-code/",
  evaluatedMetrics: BASE_PATH + "/api/input/metrics/task/evaluated/",
  courseTaskGraph:
    BASE_PATH + "/api/resource/graphics/courses-tasks/professor/",
  totalResultGraph:
    BASE_PATH + "/api/resource/graphics/total-result/professor/",
  totalResultGraphByCourse:
    BASE_PATH + "/api/resource/graphics/total-result-courses/professor/",
  taskFailedGraph: BASE_PATH + "/api/resource/graphics/tasks-failed/professor/",
};

const getToken = (params = {}) => {
  const config = {
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("token-access"),
    },
    params: params,
  };

  return config;
};

const METRICS_COLUMNS = [
  { title: "MÉTRICA", field: "metric" },
  { title: "VALOR", field: "value" },
];

const TASK_COLUMNS = [
  { title: "CURSO", field: "course" },
  { title: "RECURSO", field: "resource" },
  { title: "NOMBRE", field: "name" },
  { title: "ACTIVIDAD ID", field: "taskid" },
  { title: "DESCRIPCIÓN", field: "description" },
];

const LITTLE_TASK_COLUMNS = [
  { title: "CURSO", field: "course" },
  { title: "RECURSO", field: "resource" },
  { title: "ACTIVIDAD ID", field: "taskid" },
];

const METRIC_UPLOAD_OPTION = [
  { title: "Por Estudiante", value: 0 },
  { title: "Por Tarea", value: 1 },
  { title: "Por Input ID", value: 2 },
];

const HEX_COLORS = [
  "#7FFFD4",
  "#FFE4C4",
  "#2C272E",
  "#678983",
  "#A52A2A",
  "#6495ED",
  "#9400D3",
  "#FF1493",
  "#1E90FF",
  "#FFD700",
  "#90EE90",
  "#F08080",
  "#FFA07A",
  "#20B2AA",
  "#BA55D3",
  "#008080",
  "#FFAB4C",
  "#94B3FD",
  "#FBF46D",
  "#A7E9AF",
  "#9D5C0D",
];

export {
  ENDPOINTS,
  getToken,
  METRICS_COLUMNS,
  METRIC_UPLOAD_OPTION,
  TASK_COLUMNS,
  LITTLE_TASK_COLUMNS,
  HEX_COLORS,
};
