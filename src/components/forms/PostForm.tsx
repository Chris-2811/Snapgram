import React, { useContext, useState, useEffect } from "react";
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
import { IPost } from "@/types";
import { useToast } from "../ui/use-toast";

interface FormDataProps {
  caption: string;
  location: string;
  tags: string;
}

interface PostFormProps {
  post?: IPost;
  action: "create" | "update";
}

function PostForm({ post, action }: PostFormProps) {
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
  const [resetFileUploader, setResetFileUploader] = useState(false);

  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  useEffect(() => {
    if (action === "update") {
      setFormData({
        caption: post?.caption || "",
        location: post?.location || "",
        tags: post?.tags.join(",") || "",
      });
    }
  }, [post]);

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
          if (action === "update") {
            try {
              const docRef = doc(db, "posts", post?.id as string);
              await updateDoc(docRef, {
                caption: formData.caption,
                location: formData.location,
                tags: formData.tags.split(",").map((tag) => tag.trim()),
                photoUrls: downloadUrl
                  ? arrayUnion(downloadUrl)
                  : post?.photoUrls,
              });
              console.log("success");
            } catch (error) {
              console.log(error);
            }
          } else {
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

            toast({
              title: "Post created successfully",
              description: "Friday, February 10, 2023 at 5:57 PM",
            });

            setFormData({
              caption: "",
              location: "",
              tags: "",
            });

            setFile(null);
            setResetFileUploader(true);
          }
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
      className=" flex flex-col gap-9 lg:mt-[3.125rem] lg:min-w-[630px]"
    >
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
        <div className="relative ">
          <FileUploader fieldChange={setFile} reset={resetFileUploader} />
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
          <small className="absolute right-4 top-1/2 translate-y-1/2 text-red">
            {errors.tags}
          </small>
        )}
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
