import { toast } from "react-toastify";

export const notify = (type, message, delay) => {
  if (type === "success") {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      delay,
    });
  } else if (type === "error") {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      delay,
    });
  } else if (type === "warn") {
    toast.warn(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      delay,
    });
  } else {
    toast.info(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      delay,
    });
  }
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  const apiBase = process.env.REACT_APP_API_BASE_URL;
  let backendUrl = "";
  if (apiBase) {
    backendUrl = apiBase.replace(/\/api$/, "");
  } else if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    backendUrl = "http://localhost:5000";
  }
  return `${backendUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

