
import { WorkNavbar } from "@/app/components/modules/Navbar";
import Error from "@/app/components/utils/Error";
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

    if (res.status === 401) {
      throw new Error("Unauthorized: Please log in");
    }

    throw new Error("Failed to fetch project");
  }

  const result = await res.json();
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


    return (
      <div>
        <WorkNavbar />
      </div>
    );
  } catch (error) {
    console.error("Error rendering project page:", error);
    return (
      <div>
        <Error />
      </div>
    );
  }
}
