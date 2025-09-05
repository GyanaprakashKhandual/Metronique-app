// app/projects/[id]/page.jsx
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getProjectById(id) {
  console.log("Fetching project with ID:", id);

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`http://localhost:5000/api/v1/project/${id}`, {
    cache: "no-store",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("API failed:", res.status, res.statusText);

    if (res.status === 401) {
      throw new Error("Unauthorized: Please log in");
    }

    throw new Error("Failed to fetch project");
  }

  const result = await res.json();
  console.log("API raw result:", result);

  // ✅ Fix: Return project and works separately
  return {
    project: result.project,
    works: result.works || [],
  };
}

export async function generateMetadata({ params }) {
  try {
    const { project } = await getProjectById(params.id);

    return {
      title:
        (project?.projectName
          ? `${project.projectName} - ${project.projectDesc}`
          : "Project"),
      description: project?.projectDesc || "Project details page",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Project",
      description: "Project details page",
    };
  }
}

export default async function ProjectPage({ params }) {
  const { id } = params;

  try {
    const { project, works } = await getProjectById(id);
    console.log("Parsed project data:", project, works);

    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">{project?.projectName}</h1>
        <p className="mt-4 text-gray-700">{project?.projectDesc}</p>
        <p className="mt-2 text-sm text-gray-500">
          Created At:{" "}
          {project?.createdAt
            ? new Date(project.createdAt).toLocaleString()
            : "N/A"}
        </p>

        {/* ✅ Render works if available */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Works</h2>
          {works.length > 0 ? (
            <ul className="list-disc list-inside mt-2 text-gray-700">
              {works.map((work) => (
                <li key={work._id}>{work.name || "Unnamed work"}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-500">No works available</p>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering project page:", error);
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-gray-700">{error.message}</p>
        {error.message.includes("Unauthorized") && (
          <p className="mt-2 text-sm text-blue-600">
            <a href="/login">Please log in to continue</a>
          </p>
        )}
      </div>
    );
  }
}
