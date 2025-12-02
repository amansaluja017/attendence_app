"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";

function page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await signIn("credentials", {
      email,
      password
    })

    console.log(response);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" />

        <label>Password</label>
        <input type="password" />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default page;
