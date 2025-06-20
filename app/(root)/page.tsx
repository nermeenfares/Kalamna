// import { fetchPosts } from "@/lib/actions/thread.actions";
import "../globals.css";
import { currentUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
export default async function Home() {
  const user = await currentUser();
  const result = await fetchPosts(1, 30);
  console.log(result);
  return (
    <>
      <h1 className="head-text text-left bg-dark">Welcome to my home page</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No Posts found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
