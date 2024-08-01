import { getUserById } from "@/lib/firebase/api";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase/firebase";
import { updateDoc, doc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { storage } from "@/lib/firebase/firebase";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const params = useParams();

  if (!params.id) {
    return;
  }

  const { data: user } = useGetUserById(params.id);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
  });
  const [selectedFile, setSelectedFile] = useState<File>();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
      });
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (params.id) {
      const docRef = doc(db, "users", params.id);

      await updateDoc(docRef, { ...formData });

      if (selectedFile) {
        const storageRef = ref(storage, selectedFile.name);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        const docRef = doc(db, "users", params.id);

        await setDoc(docRef, { photoUrl: downloadUrl }, { merge: true });
      }
    }

    console.log("success");
    navigate(-1);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  }

  return (
    <div className="px-[3.75rem] pt-20">
      <div className="flex items-center gap-2">
        <img src={user?.imageUrl ? "" : "/assets/icons/edit.svg"} alt="edit" />
        <h1 className="heading-lg">Edit Profile</h1>
      </div>
      <form onSubmit={handleSubmit} className="mt-[3.125rem] lg:w-[630px] ">
        <div className="space-y-9">
          <div className="form-control">
            <label htmlFor="file">
              <div className="flex items-center gap-4 ">
                <img
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : "/assets/icons/profile-placeholder.svg"
                  }
                  alt="profile-picture"
                  className="h-[100px] w-[100px] cursor-pointer rounded-full"
                />
                <p className="cursor-pointer text-lg font-semibold text-[#0095F6]">
                  Change profile photo
                </p>
              </div>
            </label>
            <Input
              type="file"
              name="file"
              id="file"
              className="hidden"
              onChange={handleFileChange}
            ></Input>
          </div>
          <div className="form-control">
            <label htmlFor="name" className="text-lg font-medium">
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder={user?.name}
              onChange={handleChange}
              value={formData.name}
            ></Input>
          </div>
          <div className="form-control">
            <label htmlFor="username" className="text-lg font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder={user?.username}
              onChange={handleChange}
              value={formData.username}
            ></Input>
          </div>
          <div className="form-control">
            <label htmlFor="email" className="text-lg font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder={user?.email}
              onChange={handleChange}
              value={formData.email}
            ></Input>
          </div>
          <div className="form-control">
            <label htmlFor="bio" className="text-lg font-medium">
              Bio
            </label>
            <Input
              id="bio"
              type="text"
              placeholder={user?.bio}
              onChange={handleChange}
              value={formData.bio}
            ></Input>
          </div>
        </div>
        <div className="mt-10 flex justify-end">
          <Button className="bg-primary">Update Profile</Button>
        </div>
      </form>
      {}
    </div>
  );
}

export default UpdateProfile;
