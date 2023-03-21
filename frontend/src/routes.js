import Inicio from "views/Inicio.js";
import Cursos from "views/Cursos.js";
// import Notificaciones from "views/Notificaciones.js";
import Actividades from "views/Actividades.js";
import Classification from "views/Classification.js";
// import Sesion from "views/Sesion.js";
import Estadisticas from "views/Estadisticas.js";
import Usuario from "views/Usuario.js";
import Metrics from "views/Metrics.js";

var routes = [
  {
    path: "/inicio",
    name: "Inicio",
    icon: "nc-icon nc-single-copy-04",
    component: Inicio,
    layout: "/admin",
  },
  {
    path: "/cursos",
    name: "Cursos",
    icon: "nc-icon nc-bullet-list-67",
    component: Cursos,
    layout: "/admin",
  },
  {
    path: "/actividades",
    name: "Actividades",
    icon: "nc-icon nc-ruler-pencil",
    component: Actividades,
    layout: "/admin",
  },
  {
    path: "/ml",
    name: "Machine Learning",
    icon: "nc-icon nc-bulb-63",
    component: Classification,
    layout: "/admin",
  },
  {
    path: "/estadisticas",
    name: "Estadísticas",
    icon: "nc-icon nc-chart-bar-32",
    component: Estadisticas,
    layout: "/admin",
  },
  // {
  //   path: "/notificaciones",
  //   name: "Notificaciones",
  //   icon: "nc-icon nc-send",
  //   component: Notificaciones,
  //   layout: "/admin",
  // },
  {
    path: "/usuario",
    name: "Datos de usuario",
    icon: "nc-icon nc-single-02",
    component: Usuario,
    layout: "/admin",
  },
  {
    path: "/metricas",
    name: "Métricas",
    icon: "nc-icon nc-tv-2",
    component: Metrics,
    layout: "/admin",
  },

  // {
  //   path: "/sesion",
  //   name: "Sesión",
  //   icon: "nc-icon nc-tap-01",
  //   component: Sesion,
  //   layout: "/admin",
  // },
];
export default routes;
