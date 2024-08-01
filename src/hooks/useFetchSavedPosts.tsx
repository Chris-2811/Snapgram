import React, { useContext } from 'react';
import { useQueries } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/react-query/queryKeys';
import { useGetSavedPosts } from '@/lib/react-query/queriesAndMutations';
import AuthContext from '@/context/AuthContext';
import { getPostById } from '@/lib/firebase/api';

function useFetchSavedPosts() {
  const { user } = useContext(AuthContext);
  const { data: savedPosts } = useGetSavedPosts(user?.uid);

  const postsQueries = useQueries({
    queries:
      savedPosts?.map((savedPost) => ({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, savedPost.postId],
        queryFn: () => getPostById(savedPost.postId),
      })) || [],
  });

  const posts = postsQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data);

  return posts;
}

export default useFetchSavedPosts;
