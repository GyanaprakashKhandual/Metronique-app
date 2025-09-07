import Error from '@/app/components/utils/Error';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

async function getProjectById(id) {
  console.log("Fetching project with ID:", id);

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const res = await fetch(`http://localhost:5000/api/v1/project/${id}`, {
    cache: "no-store",
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {


    if (res.status === 401) {
      throw new Error("Unauthorized: Please log in");
    }

    throw new Error("Failed to fetch project");
  }

  return res.json();
}

export default async function ProjectPage({ params }) {
  const { id } = params;

  try {
    const project = await getProjectById(id);

    return (
      <div>
        <h1 className="text-3xl font-bold">{project.projectName}</h1>
        <p className="mt-4 text-gray-700">{project.projectDesc}</p>
      </div>
    );
  } catch (error) {
    return (
      <div>
        <Error />
      </div>

    );
  }
}