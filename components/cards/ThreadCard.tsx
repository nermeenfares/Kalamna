import Link from "next/link";
import Image from "next/image";
interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: { id: string; name: string } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  //   image: string;
}
const ThreadCard = ({
  id,
  currentUserId,
  content,
  author,
  community,
  parentId,
  createdAt,
  comments,
  isComment,
}: Props) => {
  return (
    <article
      className={`w-full  flex flex-col rounded-xl bg-dark-2 p-7 ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-70"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                alt="author image"
                fill
                className="cursor-pointer rounded-full"
                src={author.image}
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link className="w-fit" href={`/profile/${author.id}`}>
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5 ">
                <Image
                  alt="heart"
                  src="/assets/heart-gray.svg"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain "
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    alt="heart"
                    src="/assets/reply.svg"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain "
                  />
                </Link>
                <Image
                  alt="heart"
                  src="/assets/repost.svg"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain "
                />
                <Image
                  alt="heart"
                  src="/assets/share.svg"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain "
                />
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1  ">
                    {comments.length}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-small-regular text-light-2">{content}</h2>
    </article>
  );
};
export default ThreadCard;
