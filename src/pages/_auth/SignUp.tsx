import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import OAuth from "@/components/shared/_auth/OAuth";
import { db } from "@/lib/firebase/firebase";
import {
  setDoc,
  doc,
  serverTimestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";

interface Errors {
  email: string;
  password: string;
  name: string;
}

function SignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setformData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState<Errors>({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>();
  const { signUp, user } = useContext(AuthContext);
  const navigate = useNavigate();

  function validateForm() {
    let isValid = true;
    const newErrors: Errors = { email: "", password: "", name: "" };

    const { email, name, password } = formData;

    if (!email) {
      isValid = false;
      newErrors.email = "Can't be empty";
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)
    ) {
      isValid = false;
      newErrors.email = "Invalid email format";
    }

    if (!name) {
      isValid = false;
      newErrors.name = "Can't be empty";
    }

    if (!password) {
      isValid = false;
      newErrors.password = "Can't be empty";
    }

    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (validateForm()) {
        setIsLoading(true);
        const userCredential = await signUp(formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: formData.name,
          // other profile updates...
        });

        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, {
          email: formData.email,
          fullName: formData.name,
          createdAt: serverTimestamp(),
        });

        console.log("user created");
        setIsLoading(false);
        setformData({
          email: "",
          password: "",
          name: "",
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    if (e.target.id.length > 0) {
      setErrors({
        ...errors,
        [e.target.id]: "",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className=" w-full max-w-[400px] px-6 text-light-200 md:px-0 "
    >
      <div className="mt-[4.25rem] text-center">
        <h1 className="heading-md text-light-100">Create a new account</h1>
        <p className="mt-3 text-light-300">
          To use snapgram, Please enter your details.
        </p>
      </div>
      <div className="form-control relative mt-8">
        <label htmlFor="name ">Name</label>
        <div className="relative">
          <Input
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
            value={formData.name}
          />
          {errors.name && (
            <small className="absolute right-4 top-1/2 -translate-y-[50%] text-red">
              {errors.name}
            </small>
          )}
        </div>
      </div>
      <div className="form-control mt-8">
        <label htmlFor="email">Email</label>
        <div className="relative">
          <Input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            value={formData.email}
          />
          {errors.email && (
            <small className="absolute right-4 top-1/2 -translate-y-[50%] text-red">
              {errors.email}
            </small>
          )}
        </div>
      </div>
      <div className="form-control mt-5">
        <label htmlFor="password">Password</label>
        <div className="relative">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              onChange={handleChange}
              value={formData.password}
            />
            {errors.password && (
              <small className="absolute right-4 top-1/2 -translate-y-[50%] text-red">
                {errors.password}
              </small>
            )}
          </div>
          {!errors.password && (
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-[50%] cursor-pointer"
            >
              {!showPassword ? <FaEye className="" /> : <FaEyeSlash />}
            </div>
          )}
        </div>
      </div>
      <div className="mt-[2.625rem]">
        <Button variant="auth" size="md">
          {isLoading ? <>Processing...</> : "Sign up"}
        </Button>
      </div>
      <div className="mt-5">
        <OAuth />
      </div>
      <p className="mt-8 text-center text-sm text-light-200">
        Don't you have an account?{" "}
        <Link to="/log-in" className="ml-1 text-primary">
          Log in
        </Link>
      </p>
    </form>
  );
}

export default SignUp;
