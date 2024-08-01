/* fetch('./src/data/MOCK_DATA.json')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach(async (item) => {
      try {
        const docRef = await addDoc(collection(db, 'users'), item);
        console.log(`Document written with ID: ${docRef.id}`);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    });
  });
 */

/* const usersCollection = collection(db, 'users');

getDocs(usersCollection).then((snapshot) => {
  if (snapshot.empty) {
    fetch('./src/data/mock_users.json')
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 'HRLLO');
        data = data.map((item) => ({
          ...item,
          photoUrl: `https://source.unsplash.com/random?sig=${Math.random()}&portrait`,
        }));
        data.forEach(async (item) => {
          try {
            const docRef = await addDoc(usersCollection, item);

            console.log(`Document written with ID: ${docRef.id}`);
          } catch (e) {
            console.error('Error adding document: ', e);
          }
        });
      });
  } else {
    console.log('Data already exists in Firestore.');
  }
}); */

/* const postCollection = collection(db, 'posts');

getDocs(postCollection).then((snapshot) => {
  fetch('./src/data/mock_posts.json')
    .then((response) => response.json())
    .then((data: any) => {
      console.log(data);
      data = data.map((item) => ({
        ...item,
        photoUrl: `https://source.unsplash.com/random?sig=${Math.random()}&landscape`,
        tags: item.tags.split(' '), // Split the text into words
      }));

      // fetch users
      getDocs(usersCollection).then((userSnapshot) => {
        let remainingPosts = [...data]; // Copy the data array

        userSnapshot.docs.forEach(async (userDoc) => {
          // Select a random number of posts
          let numPosts = Math.min(
            Math.floor(Math.random() * 25),
            remainingPosts.length
          );
          let userPosts = remainingPosts.slice(0, numPosts);

          // Remove the selected posts from the remaining posts
          remainingPosts = remainingPosts.slice(numPosts);

          // Add userId to each post
          userPosts = userPosts.map((post) => ({
            ...post,
            userId: userDoc.id,
            photoUrl: `https://source.unsplash.com/random?sig=${Math.random()}&landscape`,
          }));

          // Add posts to Firestore
          userPosts.forEach(async (post) => {
            try {
              const docRef = await addDoc(postCollection, post);
              console.log(`Document written with ID: ${docRef.id}`);
            } catch (e) {
              console.error('Error adding document: ', e);
            }
          });

          // Update the user with the posts
          const userRef = doc(db, 'users', userDoc.id);
          await updateDoc(userRef, { posts: userPosts });
        });
      });
    });
});
 */

// Get all files in the 'reels/' directory of your storage bucket
/* const reelsRef = ref(storage, 'reels/');
const { items } = await listAll(reelsRef);
let fileIndex = 0;

console.log(items);

const userCollection = collection(db, 'users');
const reelsCollection = collection(db, 'reels');

const snapshot = await getDocs(userCollection);
const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

console.log(users);
console.log(items);

for (const user of users) {
  const numReels = Math.floor(Math.random() * 10) + 1;

  for (let i = 0; i < numReels; i++) {
    if (fileIndex >= items.length) {
      break;
    }

    const fileRef = items[fileIndex++];
    const url = await getDownloadURL(fileRef); // Get the download URL for the file

    const hashtag = `#${faker.lorem.word()}`; // Generate a single random hashtag
    const caption = faker.lorem.sentence(); // Generate a random sentence for the caption

    try {
      await addDoc(reelsCollection, {
        userId: user.id,
        url: url,
        hashtag: hashtag,
        caption: caption,
      });
      console.log('Document written');
    } catch (error) {
      console.log(error);
    }
  }
}
 */
