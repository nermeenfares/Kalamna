import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";

// ADD THIS: Forces the page to be dynamic (not cached)
export const dynamic = "force-dynamic";
// OR you can use:
// export const revalidate = 0;

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  try {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const result = await fetchUsers({
      userId: user.id,
      searchString: searchParams.q,
      pageNumber: searchParams?.page ? +searchParams.page : 1,
      pageSize: 25,
    });

    // Ensure result has the expected structure
    if (!result || !Array.isArray(result.users)) {
      console.error("Invalid result structure:", result);
      return (
        <section>
          <h1 className="head-text mb-10">Search</h1>
          <Searchbar routeType="search" />
          <div className="mt-14 flex flex-col gap-9">
            <p className="no-result">Unable to load users. Please try again.</p>
          </div>
        </section>
      );
    }

    return (
      <section>
        <h1 className="head-text mb-10">Search</h1>

        <Searchbar routeType="search" />

        <div className="mt-14 flex flex-col gap-9">
          {result.users.length === 0 ? (
            <p className="no-result">No Result</p>
          ) : (
            <>
              {result.users.map((person) => (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType="User"
                />
              ))}
            </>
          )}
        </div>

        <Pagination
          path="search"
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </section>
    );
  } catch (error) {
    console.error("Error in search page:", error);

    return (
      <section>
        <h1 className="head-text mb-10">Search</h1>
        <Searchbar routeType="search" />
        <div className="mt-14 flex flex-col gap-9">
          <p className="no-result">
            Something went wrong. Please try again later.
          </p>
        </div>
      </section>
    );
  }
}

export default Page;
