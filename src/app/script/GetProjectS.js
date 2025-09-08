import axios from "axios";

/**
 * Fetch project details using projectId from current URL
 * @returns {Promise<Object|null>} project details or null
 */
export const getProjectDetailsForSubWork = async () => {
  try {
    // 1. Extract projectId from current URL
    const pathSegments = window.location.pathname.split("/");

    // Find index of "projects" in the path
    const projectIndex = pathSegments.indexOf("projects");
    const projectId =
      projectIndex !== -1 ? pathSegments[projectIndex + 1] : null;

    if (!projectId) throw new Error("Project ID not found in URL");

    // 2. Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found in localStorage");

    // 3. Fetch project details from API
    const response = await axios.get(
      `http://localhost:5000/api/v1/project/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers
        },
      }
    );

    // 4. Return project data
    return response.data;
  } catch (error) {
    console.error("Error fetching project details:", error.message);
    return null;
  }
};
