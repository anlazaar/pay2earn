import { auth } from "../../../auth";

export default async function WaiterPage() {
  const session = await auth();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Staff / Waiter Dashboard</h1>
      <div className="bg-green-50 p-6 rounded-lg shadow border border-green-200">
        <p>
          Ready to serve,{" "}
          <span className="font-semibold">{session?.user?.name}</span>!
        </p>
        <p className="text-gray-500 text-sm mt-1">Role: Waiter</p>
      </div>
    </div>
  );
}
