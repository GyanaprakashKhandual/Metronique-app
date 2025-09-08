import axios from "axios";

/**
 * Fetch work details using projectId and workId
 * @returns {Promise<Object|null>} work details or null
 */
export const getWorkDetails = async () => {
  try {
    // Extract projectId from URL
    const pathSegments = window.location.pathname.split("/");
    const projectIndex = pathSegments.indexOf("projects");
    const projectId = projectIndex !== -1 ? pathSegments[projectIndex + 1] : null;

    if (!projectId) throw new Error("Project ID not found in URL");

    // Retrieve workId from localStorage
    const workId = localStorage.getItem("selectedWorkId");
    if (!workId) throw new Error("Work ID not found in localStorage");

    // Get token
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found in localStorage");

    // Fetch work details
    const response = await axios.get(
      `http://localhost:5000/api/v1/work/${projectId}/${workId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching work details:", error.message);
    return null;
  }
};

