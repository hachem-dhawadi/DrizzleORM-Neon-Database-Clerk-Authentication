import { getUser, addUser } from "@/actions/userActions";
import Todos from "@/components/Todos";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const clerkUser: any = await currentUser();
  if (!clerkUser) return;

  // Make sure user is added in local DB
  await addUser({
    clerkId: clerkUser.id,
    email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
    name: clerkUser.username || "",
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    photo: clerkUser.imageUrl || "",
  });

  // Now get the user + todos
  const fetchedData = await getUser(clerkUser.id);

  console.log("Fetched data for UI:", fetchedData);

  return (
    fetchedData && (
      <main className="flex items-center justify-between">
        <Todos
          todos={fetchedData?.[0]?.todos || []}
          user={fetchedData?.[0] || {}}
        />
      </main>
    )
  );
}
