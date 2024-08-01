import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { getDocs, updateDoc, doc } from "firebase/firestore";
import { faker } from "@faker-js/faker";
import axios, { all } from "axios";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_MESSAGING_SENDER,
  appId: import.meta.env.VITE_REACT_APP_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

async function createRandomUser() {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const fullName = firstName + " " + lastName;
  const randomNum = Math.floor(Math.random() * 100); // Generate a random number between 0 and 999

  const email =
    `${firstName}.${lastName}${randomNum}@example.com`.toLowerCase();

  // Generate a random username
  const nameOptions = [firstName, lastName, `${firstName}.${lastName}`];
  const randomName =
    nameOptions[Math.floor(Math.random() * nameOptions.length)];
  const username = `${randomName}.${randomNum}`.toLowerCase();

  // Generate a random bio
  const jobTitle = faker.person.jobTitle();
  const jobDescriptor = faker.person.jobDescriptor();
  const companyName = faker.company.name();
  const catchPhrase = faker.company.catchPhrase();

  const bio = `I am a ${jobTitle} with a knack for ${jobDescriptor}. Currently working at ${companyName}. I believe that "${catchPhrase}".`;

  // Fetch a random user from the Random User Generator API
  const response = await axios.get(`https://randomuser.me/api/?gender=${sex}`);
  const photoUrl = response.data.results[0].picture.large;

  console.log(photoUrl);

  return {
    bio,
    username: username,
    fullName,
    email,
    password: faker.internet.password(),
    createdAt: new Date(),
    photoUrl,
  };
}

/* async function createUsers() {
  for (let i = 0; i < 250; i++) {
    const user = await createRandomUser();

    if (user) {
      try {
        await addDoc(collection(db, "users"), user);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  }
} */

/* createUsers(); */

async function fetchPhotosByCategory(category) {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${category}&per_page=10`,
      {
        headers: {
          Authorization:
            "Client-ID kN5ce6cJD-IDwzHDF7tDACXvJ8BQ5XA-HFaYD1WdfU4",
        },
      },
    );

    // The response data is an object that includes a results array of photos
    const photos = response.data.results;

    return photos;
  } catch (error) {
    console.error("Error: ", error);
  }
}

const categories = [
  "nature",
  "animals",
  "architecture",
  "people",
  "travel",
  "technology",
  "sports",
  "food",
  "fashion",
  "music",
  "movies",
  "art",
  "business",
  "education",
  "health",
  "transportation",
  "space",
  "ocean",
  "mountains",
];

const allPhotos = [];

async function fetchAllCategories() {
  for (const category of categories) {
    const photos = await fetchPhotosByCategory(category);
    allPhotos.push(...photos);
  }

  shuffleArray(allPhotos);
  console.log("first", allPhotos);
}

const posts = [];

function shuffleArray(allPhotos) {
  for (let i = allPhotos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPhotos[i], allPhotos[j]] = [allPhotos[j], allPhotos[i]];
  }
}

console.log(allPhotos);

async function createPosts() {
  await fetchAllCategories();

  const usersSnapshot = await getDocs(collection(db, "users"));
  const users = usersSnapshot.docs.map((doc) => ({
    ...doc.data(),
    userId: doc.id,
  }));

  for (let i = 0; i < 50; i++) {
    const userId = users[Math.floor(Math.random() * users.length)].userId;

    console.log(userId);

    const numPhotos =
      Math.random() < 0.7 ? 1 : Math.floor(Math.random() * 2) + 2;
    const randomIndex = Math.floor(Math.random() * allPhotos.length);
    const selectedPhotos = allPhotos?.splice(randomIndex, numPhotos);

    console.log(selectedPhotos);

    if (selectedPhotos.length === 0) {
      continue;
    }

    const post = {
      caption:
        selectedPhotos.length === 1
          ? selectedPhotos[0].alt_description
          : faker.lorem.sentence(),
      createdAt: new Date(),
      userId: userId,
      location: faker.location.city(),
      photoUrls: selectedPhotos.map((photo) => photo.urls.full),
      tags: selectedPhotos.flatMap((photo) =>
        photo.tags.map((tag) => tag.title),
      ),
    };

    posts.push(post);

    try {
      const docRef = await addDoc(collection(db, "posts"), post);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log("Error adding document: ", error);
    }
  }
  console.log(posts);
}

/* createPosts(); */

/* 
fetchUntilLimit();
createPosts();
 */

// Get all files in the 'reels/' directory of your storage bucket
/* const reelsRef = ref(storage, "reels/");
const { items } = await listAll(reelsRef);
let fileIndex = 0;

console.log(items);

const userCollection = collection(db, "users");
const reelsCollection = collection(db, "reels");

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
      console.log("Document written");
    } catch (error) {
      console.log(error);
    }
  }
} */
