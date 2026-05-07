import api from "./api";

export const getHealthStatus = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    return { status: "error", message: "API is unreachable" };
  }
};
