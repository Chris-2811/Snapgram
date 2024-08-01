import {
  collection,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  startAfter,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function getRecentPosts() {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(20),
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot) throw Error;

  // Create an array of documents
  const posts = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const docRef = doc(db, "posts", postId);

    await updateDoc(docRef, {
      likes: [...likesArray],
    });
  } catch (error) {
    console.log(error);
  }
}

export async function savePost({
  userId,
  postId,
}: {
  userId: string | undefined;
  postId: string;
}) {
  try {
    const collectionRef = collection(db, "savedPosts");
    const docRef = await addDoc(collectionRef, {
      userId: userId,
      postId: postId,
    });

    const docId = docRef.id;
    return docId;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteSavedPost(docId: string) {
  const docRef = doc(db, "savedPosts", docId);

  try {
    await deleteDoc(docRef);
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}

//  Get Users
export async function getUsers({ pageParam }: { pageParam: number }) {
  let q;

  if (pageParam) {
    const lastDocSnapshot = await getDoc(doc(db, "users", pageParam));

    q = query(
      collection(db, "users"),
      orderBy("createdAt", "desc"),
      startAfter(lastDocSnapshot),
      limit(10),
    );
  } else {
    q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(10));
  }

  const querySnapshot = await getDocs(q);

  if (!querySnapshot) throw Error;

  const users = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return users;
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  let q;

  if (pageParam) {
    const lastDocSnapshot = await getDoc(doc(db, "posts", pageParam));

    q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(lastDocSnapshot),
      limit(10),
    );
  } else {
    q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(10));
  }

  await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5 seconds delay

  const querySnapshot = await getDocs(q);

  if (!querySnapshot) throw Error;

  const posts = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return posts;
}

export async function getInfiniteReels({ pageParam }: { pageParam: number }) {
  let q;

  if (pageParam) {
    const lastDocSnapshot = await getDoc(doc(db, "reels", pageParam));

    q = query(collection(db, "reels"), startAfter(lastDocSnapshot), limit(10));
  } else {
    q = query(collection(db, "reels"), limit(10));
  }

  await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5 seconds delay

  const querySnapshot = await getDocs(q);

  if (!querySnapshot) {
    return;
  }

  const reels = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return reels;
}

export const getReelsByUserId = async (
  userId: string | undefined,
  pageParam: number,
) => {
  let q;

  if (pageParam) {
    const lastDocSnapshot = await getDoc(doc(db, "reels", pageParam));

    q = query(
      collection(db, "reels"),
      where("userId", "==", userId),
      startAfter(lastDocSnapshot),
      limit(10),
    );
  } else {
    q = query(
      collection(db, "reels"),
      where("userId", "==", userId),
      limit(10),
    );
  }

  const querySnapshot = await getDocs(q);

  if (!querySnapshot) throw Error;

  const reels = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return reels;
};

export async function searchPosts(searchTerm: string) {
  const querySnapshot = await getDocs(collection(db, "posts"));

  if (!querySnapshot) throw Error;

  const posts = querySnapshot.docs
    .map((doc) => doc.data())
    .filter((post) =>
      post.tags
        .map((tag) => tag.toLowerCase())
        .includes(searchTerm.toLowerCase()),
    );

  return posts;
}

export async function getUserById(userId: string | undefined) {
  if (!userId) {
    return;
  }

  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
}

export async function getPostsById(
  userId: string | undefined,
  pageParam: number | null,
) {
  if (!userId) {
    return;
  }

  let q;

  if (pageParam && pageParam !== null) {
    const lastDocSnapshot = await getDoc(doc(db, "posts", pageParam));
    q = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("createdAt"), // You need to order by a field to paginate
      startAfter(lastDocSnapshot),
      limit(10), // Limit to 10 documents per page
    );
  } else {
    console.log("no pageParam");
    q = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("createdAt"), // You need to order by a field to paginate
      limit(10), // Limit to 10 documents per page
    );
  }

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No documents match the query.");
  }

  const posts = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })); // Add the doc ID to the data

  return posts;
}

export async function getPostById(postId: string) {
  const docRef = doc(db, "posts", postId);

  const docSnap = await getDoc(docRef);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error(`No document with ID ${postId}`);
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
}

export async function getPostsByIds(postIds: string[]) {
  const postsCollection = collection(db, "posts");
  const posts = [];

  for (const id of postIds) {
    const postDoc = await getDoc(doc(postsCollection, id));
    if (postDoc.exists()) {
      posts.push({ id: postDoc.id, ...postDoc.data() });
    }
  }

  return posts;
}

export async function getSavedPosts(
  userId: string | undefined,
  pageParam: number | null,
) {
  if (!userId) {
    return;
  }

  let q;

  if (pageParam) {
    const lastDocSnapshot = await getDoc(doc(db, "savedPosts", pageParam));

    q = query(
      collection(db, "savedPosts"),
      where("userId", "==", userId),
      startAfter(lastDocSnapshot),
      limit(10),
    );
  } else {
    q = query(
      collection(db, "savedPosts"),
      where("userId", "==", userId),
      limit(10),
    );
  }

  const querySnapshot = await getDocs(q);

  const savedPosts = querySnapshot.docs.map((doc) => doc.data());

  return savedPosts;
}

export async function checkIfLiked({ setIsLiked, post }) {
  const colRef = collection(db, "likes");

  const q = query(
    colRef,
    where("userId", "==", post.userId),
    where("postId", "==", post.id),
  );

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setIsLiked(false);
      return false;
    } else {
      setIsLiked(true);
    }
  } catch (error) {
    console.error("Error getting documents: ", error);
  }

  return true;
}

export async function getLikesByPostId(postId: string) {
  const q = query(collection(db, "likes"), where("postId", "==", postId));

  const querySnapshot = await getDocs(q);

  const likes = querySnapshot.docs.map((doc) => doc.data());

  return likes;
}

export async function getCommentsByPostId(postId: string) {
  const q = query(collection(db, "comments"), where("postId", "==", postId));

  const querySnapshot = await getDocs(q);

  const comments = querySnapshot.docs.map((doc) => doc.data());

  return comments;
}
