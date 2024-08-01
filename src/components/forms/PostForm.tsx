import React, { useContext, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/_main/FileUploader";
import { Button } from "../ui/button";
import { db } from "@/lib/firebase/firebase";
import {
  setDoc,
  doc,
  arrayUnion,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import AuthContext from "@/context/AuthContext";
import { storage } from "@/lib/firebase/firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { FileWithPath } from "react-dropzone";
import { addDoc, collection } from "firebase/firestore";

interface FormDataProps {
  caption: string;
  location: string;
  tags: string;
}

function PostForm() {
  const [formData, setFormData] = useState<FormDataProps>({
    caption: "",
    location: "",
    tags: "",
  });
  const [file, setFile] = useState<FileWithPath | null>(null);
  const [errors, setErrors] = useState({
    caption: "",
    file: "",
    location: "",
    tags: "",
  });
  const { user } = useContext(AuthContext);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  function validateForm() {
    let isValid = true;
    const newErrors = {
      caption: "",
      file: "",
      location: "",
      tags: "",
    };

    if (!formData.caption) {
      isValid = false;
      newErrors.caption = "can't be empty";
    }

    if (!formData.location) {
      isValid = false;
      newErrors.location = "can't be empty";
    }

    if (!formData.tags) {
      isValid = false;
      newErrors.tags = "can't be empty";
    }

    if (!file) {
      isValid = false;
      newErrors.file = "please upload a file";
    }

    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (validateForm()) {
      if (user) {
        let downloadUrl = null;

        if (file) {
          try {
            const storageRef = ref(storage, "/images/" + file.path);
            const snapshot = await uploadBytes(storageRef, file);
            downloadUrl = await getDownloadURL(snapshot.ref);
          } catch (error) {
            console.log(error);
          }
        }

        try {
          const postsCollectionRef = collection(db, "posts");
          const newPost = {
            ...formData,
            tags: formData.tags.split(",").map((tag) => tag.trim()),
          };
          await addDoc(postsCollectionRef, {
            ...newPost,
            photoUrls: [downloadUrl],
            userId: user.uid,
            createdAt: serverTimestamp(),
          });

          const docRef = doc(db, "users", user?.uid);

          await updateDoc(docRef, {
            posts: arrayUnion({ ...formData, photoUrl: downloadUrl }),
          });
          console.log("success");
        } catch (error) {
          console.log(error);
        }

        console.log(file);
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 md:px-10 lg:min-w-[630px] lg:px-[3.75rem]"
    >
      <div className="flex flex-col gap-9">
        <div className="flex items-center gap-2">
          <img
            src="/assets/icons/gallery-add.svg"
            alt=""
            className="invert-white w-9"
          />
          <h1 className="heading-lg">Create a Post</h1>
        </div>

        <div className="form-control relative">
          <label htmlFor="caption" className="text-lg font-medium">
            Caption
          </label>
          <Textarea
            rows={5}
            id="caption"
            onChange={handleChange}
            value={formData.caption}
          />
          {errors.caption && (
            <small className="absolute right-4 top-1/2 -translate-y-1/2 text-red">
              {errors.caption}
            </small>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="location" className="mb-3 block  text-lg font-medium">
            Add Photos/Videos
          </label>
          <div className="relative">
            <FileUploader fieldChange={setFile} />
            {errors.file && (
              <small className="absolute right-4 top-4 text-red ">
                {errors.file}
              </small>
            )}
          </div>
        </div>
        <div className="form-control ">
          <label htmlFor="location" className="text-lg font-medium">
            Add Location
          </label>
          <div className="relative">
            <Input
              type="text"
              name="location"
              id="location"
              onChange={handleChange}
              value={formData.location}
            />
            {!errors.location && (
              <img
                src="/assets/icons/point.svg"
                alt=""
                className="absolute right-5 top-1/2 -translate-y-1/2 "
              />
            )}
            {errors.location && (
              <small className="absolute right-4 top-1/2 -translate-y-1/2 text-red">
                {errors.location}
              </small>
            )}
          </div>
        </div>
        <div className="form-control relative">
          <label htmlFor="text" className="text-lg font-medium">
            Add Tags seperated by comma " ,"
          </label>
          <Input
            type="text"
            name="tags"
            id="tags"
            onChange={handleChange}
            value={formData.tags}
          />
          {errors.tags && (
            <small className="absolute right-4 top-1/2 -translate-y-1/2 text-red">
              {errors.tags}
            </small>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="mt-10 bg-primary px-5 py-3">
          Share Post
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
