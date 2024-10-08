import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";

function Signup() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

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
        .post(import.meta.env.VITE_BACKEND_URL + "/user/register", input)
        .then((res) => {
          console.log(res);

          if (res.data.success) {
            toast.success(res.data.message);
            setInput({
              username: "",
              email: "",
              password: "",
            });
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

        <Button type="submit">Signup</Button>
      </form>
    </div>
  );
}

export default Signup;
