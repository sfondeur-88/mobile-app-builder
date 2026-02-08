import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Mobile App Builder
        </h1>
        <p className="text-gray-600 mb-8">
          Authentication successful! Editor coming soon
        </p>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}