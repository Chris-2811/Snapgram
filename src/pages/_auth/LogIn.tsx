import { Input } from '@/components/ui/input';
import { useContext, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import OAuth from '@/components/shared/_auth/OAuth';

function LogIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { logIn } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const userCredentials = await logIn(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  console.log(formData);

  return (
    <form
      onSubmit={handleSubmit}
      className=" text-light-200 w-full max-w-[400px] px-6 md:px-0 "
    >
      <img
        src="/assets/images/logo.svg"
        alt="company logo"
        className="mx-auto"
      />
      <div className="text-center mt-[4.25rem]">
        <h1 className="heading-md text-light-100">Log in to your account</h1>
        <p className="text-light-300 mt-3">
          Welcome back! Please enter your details.
        </p>
      </div>
      <div className="form-control mt-8">
        <label htmlFor="email">Email</label>
        <Input
          type="email"
          name="email"
          id="email"
          onChange={handleChange}
          value={formData.email}
        />
      </div>
      <div className="form-control mt-5">
        <label htmlFor="name">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="name"
            onChange={handleChange}
            value={formData.password}
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 -translate-y-[50%] right-4 cursor-pointer"
          >
            {!showPassword ? <FaEye className="" /> : <FaEyeSlash />}
          </div>
        </div>
      </div>
      <div className="mt-[2.625rem]">
        <Button variant="auth" size="md">
          Log In
        </Button>
      </div>
      <div className="mt-5">
        <OAuth />
      </div>
      <p className="text-center mt-8 text-sm text-light-200">
        Don't you have an account?{' '}
        <Link to="/sign-up" className="text-primary ml-1">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default LogIn;
