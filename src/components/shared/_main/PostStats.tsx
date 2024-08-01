import AuthContext from "@/context/AuthContext";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useCheckIfLiked,
  useGetLikesByPostId,
  useGetPostById,
} from "@/lib/react-query/queriesAndMutations";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { db } from "@/lib/firebase/firebase";
import {
  addDoc,
  collection,
  doc,
  get,
  query,
  where,
  getDocs,
  deleteDoc,
  increment,
  updateDoc,
} from "firebase/firestore";

function PostStats({ post, comments }) {
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavedPost();
  const [isLiked, setIsLiked] = useState<boolean>();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [docId, setDocId] = useState<String | null>();
  const { user } = useContext(AuthContext);
  const { isLoading } = useCheckIfLiked(setIsLiked, post);
  const { data: likes, refetch: refetchLikes } = useGetLikesByPostId(post.id);
  const { refetch } = useGetPostById(post.id);

  async function handleLikePost() {
    const colRef = collection(db, "likes");

    // query for like by the user inside likes

    const q = query(
      colRef,
      where("userId", "==", post.userId),
      where("postId", "==", post.id),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const docRef = await addDoc(colRef, {
        userId: post.userId,
        postId: post.id,
      });

      setIsLiked(true);
    } else {
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(db, "likes", docId);
      await deleteDoc(docRef);
      setIsLiked(false);
    }

    refetchLikes();
  }

  function handleSavePost() {
    setIsSaved(!isSaved);

    if (!isSaved) {
      savePost(
        { userId: user?.uid, postId: post.id },
        {
          onSuccess: (data, variables, context) => {
            setDocId(data);
          },
        },
      );
    } else {
      deleteSavedPost(docId);
    }
  }

  async function handleSharePost() {
    try {
      const docRef = doc(db, "posts", post.id);

      await updateDoc(docRef, {
        shares: increment(1),
      });

      refetch();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    !isLoading && (
      <div className="mt-[1.875rem] flex items-center justify-between">
        <div className=" flex justify-between gap-[1.875rem]">
          <div className="flex items-center gap-[0.375rem] ">
            <img
              src={
                isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"
              }
              alt=""
              onClick={handleLikePost}
              className="w-5 cursor-pointer"
            />
            <p className="min-w-[10px]">{likes?.length}</p>
          </div>
          <div className="flex items-center gap-[0.375rem]">
            <img src="/assets/icons/chat.svg" alt="" />
            <p className="min-w-[10px]">{comments ? comments.length : "0"}</p>
          </div>
          <div
            onClick={handleSharePost}
            className="flex cursor-pointer items-center gap-[0.375rem]"
          >
            <img src="/assets/icons/share.svg" alt="share-icon" />
            <p className="min-w-[10px]">{post.shares ? post.shares : "0"}</p>
          </div>
        </div>
        <div onClick={handleSavePost} className="cursor-pointer">
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt=""
            className="w-5"
          />
        </div>
      </div>
    )
  );
}

export default PostStats;
