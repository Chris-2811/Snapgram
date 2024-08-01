import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { db } from "@/lib/firebase/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { IPost } from "@/types";
import { formatPostDate } from "@/lib/utils";
import { useSwipeable } from "react-swipeable";

function PostCard({ post }: { post: IPost }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState<boolean>(false);

  if (!post || !post.userId) {
    return null;
  }

  const { user } = useContext(AuthContext);
  const {
    data: creator,
    isLoading,
    isFetched,
    isError,
  } = useGetUserById(post.userId);

  const dateString = formatPostDate(post.createdAt);

  if (isError) {
    console.error("An error occurred: ", isError);
  }

  const captionPreview =
    post.caption.length > 100
      ? `${post.caption.slice(0, 100)} ...`
      : post.caption;

  function handlePhotoClick() {
    console.log("Photo clicked");
    console.log("post.photoUrls.length", post.photoUrls.length);
    if (post.photoUrls.length > 1) {
      setActivePhotoIndex((prev) => (prev + 1) % post.photoUrls.length);
    }
  }

  if (post) {
    console.log(post?.photoUrls[0]);
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setActivePhotoIndex((prev) => (prev + 1) % post.photoUrls.length);
    },
    onSwipedRight: () => {
      setActivePhotoIndex((prev) => (prev - 1) % post.photoUrls.length);
    },
    trackMouse: true,
  });

  return (
    <div className="rounded-[30px] border border-dark-400 bg-dark-300 px-4 pb-8 pt-[1.375rem] md:px-7 lg:pb-[7.75rem] lg:pt-9 ">
      <div className="flex  justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.userId}`}>
              <img
                src={
                  creator?.photoUrl
                    ? creator.photoUrl
                    : "/assets/images/profile.png"
                }
                alt="creator"
                className="h-[50px] w-[50px] rounded-full"
              />
            </Link>
            <div>
              <p className="text-[1.125rem] font-bold tracking-[-1px] text-light-200">
                {creator?.fullName}
              </p>
              <small className="text-sm text-light-300">{dateString}</small>
            </div>
          </div>
        </div>
        {user?.uid === post.userId && (
          <img
            src="assets/icons/edit.svg"
            alt="edit"
            className="h-5 w-5 cursor-pointer"
          />
        )}
        {/*  <img src="/assets/icons/edit.svg" alt="" className="w-5" /> */}
      </div>
      <div className="mb-8 mt-5 font-semibold leading-[1.5]">
        <div className="max-w-lg">
          {!isCaptionExpanded ? captionPreview : post.caption}
          {post.caption.length > 100 && (
            <span
              onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
              className={`text-xs text-light-300 ${
                isCaptionExpanded && "ml-0"
              } ml-2 cursor-pointer whitespace-nowrap`}
            >
              {isCaptionExpanded ? "Show less" : "Show more"}
            </span>
          )}
        </div>
        <span
          className={`flex gap-2 text-light-400 ${
            post.caption.length > 50 && "mt-2"
          }`}
        >
          {post.tags.slice(0, 3).map((tag: string, index) => (
            <span key={index} className={`text-light-400 `}>
              #{tag}
            </span>
          ))}
        </span>
      </div>
      <div
        {...swipeHandlers}
        onClick={handlePhotoClick}
        className="relative cursor-pointer overflow-hidden rounded-[30px]"
      >
        <img
          src={
            post.photoUrls[activePhotoIndex] ||
            "/assets/icons/profile-placeholder.svg"
          }
          alt="post-image"
          className="h-[295px] w-full object-cover lg:h-[520px]"
        />
      </div>
      <div className="mt-2 flex justify-center gap-2">
        {post.photoUrls.length > 1 &&
          post.photoUrls.map((photoUrl, index) => (
            <div
              onClick={() => setActivePhotoIndex(index)}
              className={`h-[0.6125rem] w-[0.6125rem] cursor-pointer rounded-full  ${index === activePhotoIndex ? "bg-white" : "bg-light-400"}`}
            ></div>
          ))}
      </div>
      <PostStats post={post} userId={user?.uid} />
      <form className="mt-10 flex items-center gap-4">
        <img
          src="/assets/images/profile.png"
          alt="profile picture"
          className="h-10 w-10"
        />
        <div className="form-control relative w-full">
          <Input
            className="mt-0 h-11 bg-dark-400 placeholder:text-light-400"
            placeholder="Write your comment..."
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2">
            <img src="/assets/icons/plain.svg" alt="" className="" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostCard;
