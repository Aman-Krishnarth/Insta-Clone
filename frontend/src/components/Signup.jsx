import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

function Signup() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const inputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios
        .post(import.meta.env.VITE_BACKEND_URL + "/user/register", input)
        .then((res) => {

          if (res.data.success) {
            navigate("/login");
            toast.success(res.data.message);
            setInput({
              username: "",
              email: "",
              password: "",
            });
          }else{
            toast.error(res.data.message)
          }
        })
        .catch((err) => {
          console.log("signup axios catch");
          toast.error(err.data.message)
        });
    } catch (error) {
      console.log("Handle form submit catch");
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
            Signup to see photos and videos of your friends.
          </p>
        </div>

        <div>
          <Label className="text-lg">Username</Label>
          <Input
            type="text"
            className="focus-visible:ring-transparent my-2"
            value={input.username}
            name="username"
            onChange={inputHandler}
          />
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

        {loading ? (
          <Button>
            {" "}
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-xl" />{" "}
          </Button>
        ) : (
          <Button type="submit">Signup</Button>
        )}

        <span className="text-center text-lg">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-700 hover:text-blue-400 hover:underline"
          >
            Login
          </Link>{" "}
        </span>
      </form>
    </div>
  );
}

export default Signup;