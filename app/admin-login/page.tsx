"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, Resolver } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.email || values.password ? values : {},
    errors: !values.email
      ? {
          email: {
            type: "required",
            message: "This is required.",
          },
          password: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};

function page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const onSubmit = handleSubmit(async (data) => {
    console.log("Form Data", data);
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/admin-dashboard",
      });
      navigate.push("/admin-dashboard");
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input type="email" {...register("email")} />

        <label>Password</label>
        <input type="password" {...register("password")} />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default page;
