import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import {
  getRecentPosts,
  likePost,
  savePost,
  deleteSavedPost,
  getUsers,
  getInfinitePosts,
  searchPosts,
  getUserById,
  getPostsById,
  getSavedPosts,
  checkIfLiked,
  getLikesByPostId,
  getCommentsByPostId,
  getPostsByIds,
  getInfiniteReels,
  getReelsByUserId,
  getPostById,
} from "../firebase/api";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      postId,
    }: {
      userId: string | undefined;
      postId: string;
    }) => savePost({ userId, postId }),
    onSuccess: (docId) => {
      console.log(docId);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetUsers = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_USERS, null],
    queryFn: getUsers as any,
    getNextPageParam: (lastPage: any) => {
      if (lastPage.length < 10) {
        return undefined; // Return undefined instead of null when there are
      }

      const lastId = lastPage[lastPage.length - 1]?.id;

      if (!lastId) {
        console.error("Last user ID not found");
        return undefined;
      }

      return lastId;
    },
    initialPageParam: 0,
  });
};

interface Post {
  id: string;
  // other fields...
}

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS, null],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.length === 0) {
        return undefined; // Return undefined instead of null when there are no more pages
      }

      const lastId = lastPage[lastPage.length - 1]?.id;

      if (!lastId) {
        console.error("Last post ID not found");
        return undefined;
      }

      return lastId;
    },
    initialPageParam: 0,
  });
};

export const useGetReels = () => {
  console.log("hook gets called here");
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_REELS, null],
    queryFn: getInfiniteReels as any,
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.length === 0) {
        console.log("lastPage", lastPage);
        return undefined; // Return undefined instead of null when there are no more pages
      }

      const lastId = lastPage[lastPage.length - 1]?.id;

      if (!lastId) {
        console.error("Last post ID not found");
        return undefined;
      }

      return lastId;
    },
    initialPageParam: 0,
  });
};

export const useGetReelsById = (userId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_REELS_BY_ID, userId],
    queryFn: ({ pageParam = null }) => getReelsByUserId(userId, pageParam),
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.length < 10) {
        return undefined; // Return undefined instead of null when there are no more pages
      }

      const lastId = lastPage[lastPage.length - 1]?.id;

      return lastId;
    },
    initialPageParam: 0,
    enabled: !!userId,
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetUserById = (userId: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useGetPostsById = (userId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POSTS_BY_ID, userId],
    queryFn: ({ pageParam = null }) => getPostsById(userId, pageParam),
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.length < 10) {
        return undefined; // Return undefined instead of null when there are no more pages
      }

      console.log("lastPage", lastPage);
      console.log("lastItem", lastPage[lastPage.length - 1].id);

      const lastId = lastPage[lastPage.length - 1]?.id;

      return lastId;
    },
    initialPageParam: 0,
    enabled: !!userId,
  });
};

export const useGetPostsByIds = (userIds: string[]) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS_BY_IDS, userIds],
    queryFn: () => getPostsByIds(userIds),
    enabled: !!userIds,
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetSavedPosts = (userId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_POSTS, userId],
    queryFn: ({ pageParam = null }) => getSavedPosts(userId, pageParam),
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.length < 10) {
        return undefined; // Return undefined instead of null when there are no more pages
      }

      const lastId = lastPage[lastPage.length - 1]?.id;

      return lastId;
    },
    initialPageParam: 0,
    enabled: !!userId,
  });
};

export const useCheckIfLiked = (setIsLiked, post) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHECK_IF_LIKED, post?.id, post?.userId],
    queryFn: () => checkIfLiked({ setIsLiked, post }),
    enabled: !!post,
  });
};

export const useGetLikesByPostId = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIKES_BY_POST_ID, postId],
    queryFn: () => getLikesByPostId(postId),
    enabled: !!postId,
  });
};

export const useGetCommentsByPostId = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMMENTS_BY_POST_ID, postId],
    queryFn: () => getCommentsByPostId(postId),
    enabled: !!postId,
  });
};
