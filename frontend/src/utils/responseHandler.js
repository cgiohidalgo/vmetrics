import { showAlert } from "./notifications";

export const responseHandler = (error, context) => {
  try {
    if (error.status >= 500) {
      try {
        return showAlert(500, error.data);
      } catch (e) {
        return showAlert(
          500,
          "El servicio no está disponible en este momento, por favor intente más tarde 🤦 "
        );
      }
    }
    if (error.status >= 401) {
      context.setUser({ logged: false });
    }

    if (error.status >= 400) {
      try {
        return showAlert(error.status, error.data);
      } catch (e) {
        return showAlert(error.status, "No se encontraron resultados 😖");
      }
    }

    if (error.status >= 300) {
      try {
        return showAlert(error.status, error.data);
      } catch (e) {
        return showAlert(error.status, "Redirecting...");
      }
    }

    if (error.status >= 200) {
      try {
        return showAlert(error.status, error.data);
      } catch (e) {
        return showAlert(error.status, "Ok");
      }
    }
  } catch (error) {
    return showAlert(500, "Ha ocurrido un error inesperado. ( ಠ ʖ̯ ಠ ) ");
  }
};
