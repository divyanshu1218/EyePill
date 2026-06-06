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
  const trimmedPath = imagePath.trim();
  if (trimmedPath.startsWith("http") || trimmedPath.startsWith("data:")) {
    return trimmedPath;
  }

  const encodedPath = encodeURI(trimmedPath);
  const apiBase = process.env.REACT_APP_API_BASE_URL;
  const backendUrl = apiBase ? apiBase.replace(/\/api$/, "") : "";

  if (backendUrl) {
    return `${backendUrl}${encodedPath.startsWith("/") ? "" : "/"}${encodedPath}`;
  }

  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return `http://localhost:5000${encodedPath.startsWith("/") ? "" : "/"}${encodedPath}`;
  }

  return `${encodedPath.startsWith("/") ? "" : "/"}${encodedPath}`;
};

