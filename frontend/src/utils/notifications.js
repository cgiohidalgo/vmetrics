import React from "react";

const notificationAlert = React.createRef();

const showAlert = (code, alert, position = "tr", duration = 8) => {
  let type = "";
  switch (true) {
    case code >= 500:
      type = "danger";
      break;
    case code >= 400:
      type = "warning";
      break;
    case code >= 300:
      type = "primary";
      break;
    case code >= 200:
      type = "success";
      break;
    default:
      type = "info";
  }
  let options = {};
  options = {
    place: position,
    message: <div>{alert}</div>,
    type: type,
    icon: "nc-icon nc-bell-55",
    autoDismiss: duration,
  };
  try {
    return notificationAlert.current.notificationAlert(options);
  } catch (error) {
    console.log(error);
  }
};

export { showAlert, notificationAlert };
