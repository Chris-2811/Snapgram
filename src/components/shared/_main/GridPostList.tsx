import React from "react";
import { useState } from "react";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import PostStats from "./PostStats";
import PostDetails from "./PostDetails";

function GridPostList({ posts }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState(null);
  const {
    data: creator,
    isLoading,
    isFetched,
    isError,
  } = useGetUserById(currentPost?.userId);

  function handleClick(post: any) {
    setShowModal(!showModal);

    setCurrentPost(post);
  }

  function handleCloseModal(e: React.MouseEvent) {
    setShowModal(false);
  }

  return (
    <div>
      <ul role="list" className="flex flex-wrap gap-5">
        {posts.map((post) => (
          <div>
            <li
              onClick={() => handleClick(post)}
              className="h-[357px] cursor-pointer overflow-hidden rounded-[16px]"
            >
              {post?.photoUrls ? (
                <img
                  src={post.photoUrls[0]}
                  alt=""
                  width={340}
                  className="h-full"
                />
              ) : (
                <video></video>
              )}
            </li>
          </div>
        ))}
      </ul>
      {showModal && !isLoading && (
        <>
          <PostDetails
            handleCloseModal={handleCloseModal}
            currentPost={currentPost}
            creator={creator}
          />
        </>
      )}
    </div>
  );
}

export default GridPostList;
