import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { Eye, EyeClosed } from "lucide-react";

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);

  const inputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios
        .post(import.meta.env.VITE_BACKEND_URL + "/user/login", input)
        .then((res) => {

          if (res.data.success) {
            localStorage.setItem("token", res.data.token);
            dispatch(setAuthUser(res.data.user));
            navigate("/");
            toast.success(res.data.message);
            setInput({
              email: "",
              password: "",
            });
          } else {
            toast.error("Email or Password is wrong");
          }
        })
        .catch((err) => {
          console.log("login axios catch".toUpperCase());
          toast.error("Something went wrong");
        });
    } catch (error) {
      console.log("Handle form submit catch".toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center w-screen h-lvh justify-center">
      <form
        onSubmit={handleFormSubmit}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div>
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center font-semibold">
            Login to see photos and videos of your friends.
          </p>
        </div>

        <div>
          <Label className="text-lg">Email</Label>
          <Input
            type="email"
            className="focus-visible:ring-transparent my-2"
            value={input.email}
            name="email"
            onChange={inputHandler}
          />
        </div>

        <div>
          <Label className="text-lg">Password</Label>

          <div className="flex items-center gap-2">
            <Input
              type={`${showPassword ? "text" : "password"}`}
              className="focus-visible:ring-transparent my-2"
              value={input.password}
              name="password"
              onChange={inputHandler}
            />

            {showPassword ? (
              <Eye
                onClick={() => setShowPassword(!showPassword)}
                className="hover:cursor-pointer"
              />
            ) : (
              <EyeClosed
                onClick={() => setShowPassword(!showPassword)}
                className="hover:cursor-pointer"
              />
            )}
          </div>
        </div>

        {loading ? (
          <Button>
            {" "}
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-xl" />{" "}
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}

        <span className="text-center text-lg">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-700 hover:text-blue-400 hover:underline"
          >
            Signup
          </Link>{" "}
        </span>
      </form>
    </div>
  );
}

export default Login;