import React, { ChangeEvent, FormEvent, useContext } from "react";
import PostStats from "./PostStats";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useGetCommentsByPostId } from "@/lib/react-query/queriesAndMutations";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { getUserById } from "@/lib/firebase/api";
import { useQueries } from "@tanstack/react-query";
import AuthContext from "@/context/AuthContext";

function PostDetails({ handleCloseModal, currentPost, creator }) {
  const [text, setText] = useState("");
  const [isCaptionExpened, setIsCaptionExpended] = useState<boolean>(false);
  const { data: comments, refetch: refetchComments } = useGetCommentsByPostId(
    currentPost.id,
  );
  const sortedComments = comments?.sort((a, b) => b.timestamp - a.timestamp);
  const recentComments = sortedComments?.slice(0, 3);
  const userQueries = useQueries({
    queries:
      recentComments?.map((comment) => ({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, comment.userId],
        queryFn: () => getUserById(comment.userId),
      })) || [],
  });
  const { user } = useContext(AuthContext);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const colRef = collection(db, "comments");

    try {
      await addDoc(colRef, {
        postId: currentPost.id,
        userId: user?.uid,
        text: text,
        timestamp: serverTimestamp(),
      });

      setText("");
      refetchComments();
    } catch (error) {
      console.log(error);
    }
  }

  function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  const captionPreview = `${currentPost.caption.slice(0, 100)}...`;

  return (
    <div>
      <div
        onClick={handleCloseModal}
        className="fixed inset-0 flex items-center justify-center bg-[#202020] opacity-60"
      ></div>
      <div className="fixed  left-1/2  top-1/2 flex min-h-[600px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[30px] bg-dark-200   xl:w-[1110px] ">
        <img
          src={currentPost.photoUrls[0]}
          alt=""
          className="min-h-full xl:w-[510px]"
        />
        <div className="px-7 pb-[1.875rem] pt-9 xl:w-[600px]">
          <div className="flex justify-between">
            <div className="">
              <div className="flex items-center gap-3">
                <img
                  src={`${
                    creator.photoUrl
                      ? creator.photoUrl
                      : "/assets/images/profile.png"
                  }`}
                  alt="profile picture"
                  className="h-[50px] w-[50px] rounded-full"
                />
                <div>
                  <p className="text-[1.125rem] font-bold tracking-[-1px] text-light-200">
                    {creator.name}
                  </p>
                  <small className="text-sm text-light-300">
                    @Lewishamilton
                  </small>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <img
                src="/assets/icons/edit.svg"
                alt="edit"
                className="w-5 cursor-pointer"
              />
              <img
                src="/assets/icons/delete.svg"
                alt="delete"
                className="w-5 cursor-pointer"
              />
            </div>
          </div>
          <div className="mt-5">
            <p>
              <div className="max-w-lg font-semibold">
                {isCaptionExpened ? currentPost.caption : captionPreview}
                <span
                  onClick={() => setIsCaptionExpended(!isCaptionExpened)}
                  className="ml-2 cursor-pointer whitespace-nowrap text-xs text-light-300"
                >
                  {isCaptionExpened ? "show less" : "show more"}
                </span>
              </div>

              <span
                className={`flex gap-2 text-light-400 ${
                  currentPost.caption.length > 50 && "mt-2"
                }`}
              >
                {currentPost.tags.slice(0, 3).map((tag: string) => (
                  <p>#{tag}</p>
                ))}
              </span>
            </p>
          </div>

          {/* Comments */}
          <div className="mt-[3.75rem] space-y-[1.875rem]">
            {recentComments?.map((item, index) => (
              <div className="flex items-start justify-between ">
                <div className="flex gap-2 ">
                  <img
                    src={
                      userQueries[index].data?.photoUrl
                        ? userQueries[index].data?.photoUrl
                        : "assets/icons/profile-placeholder.svg"
                    }
                    alt="avatar"
                    width={36}
                    className="h-[36px] rounded-full"
                  />
                  <div className="">
                    <div className="flex items-center gap-[0.625rem]">
                      <p className="text-xs font-medium lg:max-w-[376px]">
                        <h3 className="mr-3 inline text-sm font-semibold tracking-[-1px] text-light-300">
                          {userQueries[index].data?.username
                            ? userQueries[index].data?.username
                            : userQueries[index].data?.name}
                        </h3>
                        {item.text}
                      </p>
                    </div>
                    <div className="mt-1">1d</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/icons/like.svg"
                    alt="like-post"
                    width={16}
                  />
                  <p className="text-[10px] text-light-300">4 likes</p>
                </div>
              </div>
            ))}
          </div>
          <PostStats post={currentPost} comments={comments} />
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex items-center gap-4"
          >
            <img
              src="/assets/images/profile.png"
              alt="profile picture"
              className="h-10 w-10"
            />
            <div className="form-control relative w-full">
              <Input
                className="mt-0 h-11 bg-dark-400 placeholder:text-light-400"
                placeholder="Write your comment..."
                onChange={handleTextChange}
                value={text}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2">
                <img src="/assets/icons/plain.svg" alt="" className="" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
