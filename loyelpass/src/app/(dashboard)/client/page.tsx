import { auth } from "../../../auth";

export default async function ClientPage() {
  const session = await auth();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">My Rewards</h1>
      <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-200">
        <p>
          Hello, <span className="font-semibold">{session?.user?.name}</span>!
        </p>
        <p className="text-gray-500 text-sm mt-1">Role: Client</p>
      </div>
    </div>
  );
}
