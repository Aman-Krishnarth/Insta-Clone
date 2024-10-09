import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

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
        .post(import.meta.env.VITE_BACKEND_URL + "/user/login", input,{
          headers: {
              'Content-Type': 'application/json'
          },
          withCredentials: true
      })
        .then((res) => {
          console.log(res);

          if (res.data.success) {
            navigate('/')
            toast.success(res.data.message);
            setInput({
              email: "",
              password: "",
            });
          }else{
            toast.error(res.data.message)
          }
        })
        .catch((err) => {
          console.log("signup axios catch");
        });
    } catch (error) {
      console.log("Handle form submit catch");
    } finally {
      setLoading(false);
    }
  };

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
          <Input
            type="password"
            className="focus-visible:ring-transparent my-2"
            value={input.password}
            name="password"
            onChange={inputHandler}
          />
        </div>

        {loading ? (
          <Button>
            {" "}
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-xl" />{" "}
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}

       
        <span className="text-center text-lg">Don't have an account? <Link to="/signup" className="text-blue-700 hover:text-blue-400 hover:underline">Signup</Link> </span>
      </form>
    </div>
  );
}

export default Login;
