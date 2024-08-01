import GridPostList from "@/components/shared/_main/GridPostList";
import Tabbar from "@/components/ui/Tabbar";
import {
  useGetPostsById,
  useGetPostsByIds,
  useGetSavedPosts,
} from "@/lib/react-query/queriesAndMutations";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

function SavedPosts() {
  const { user } = useContext(AuthContext);
  const { data: savedPosts } = useGetSavedPosts(user?.uid);

  const allPosts = savedPosts?.pages.flatMap((page) => {
    return page?.map((post) => post);
  });

  const postIds = allPosts?.map((savedPost) => savedPost?.postId) || [];

  const { data: savedPostsData } = useGetPostsByIds(postIds);

  return (
    <div className="px-[3.75rem] pt-20">
      <div className="flex items-center gap-2">
        <img src="/assets/icons/save.svg" alt="" width={36} height={36} />
        <h1 className="heading-lg">Saved Posts</h1>
      </div>
      <Tabbar />
      {savedPostsData && <GridPostList posts={savedPostsData} />}
    </div>
  );
}

export default SavedPosts;
