import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function EditPost() {
  const params = useParams();
  console.log("params", params);
  const postId = params.id;
  const { data: post, isLoading, isError } = useGetPostById(postId!);

  if (isLoading) {
    console.log("Loading...");
  } else {
    console.log("post", post);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-10 lg:px-[3.75rem] lg:pt-20 ">
      <div className="flex items-center gap-2">
        <img
          src="/assets/icons/gallery-add.svg"
          alt=""
          className="invert-white w-9"
        />
        <h1 className="heading-lg">Update Post</h1>
      </div>
      <PostForm action="update" post={post} />
    </div>
  );
}

export default EditPost;
