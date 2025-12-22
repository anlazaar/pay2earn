import { auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function DashboardRouter() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Check role and redirect accordingly
  const role = session.user.role;

  switch (role) {
    case "ADMIN":
      redirect("/admin");
    case "BUSINESS":
      redirect("/business");
    case "WAITER":
      redirect("/waiter");
    case "CLIENT":
      redirect("/client");
    default:
      return (
        <div className="p-10 text-center">
          <h1 className="text-xl font-bold text-red-500">
            Error: Unknown Role
          </h1>
          <p>Your account does not have a valid role assigned.</p>
        </div>
      );
  }
}
