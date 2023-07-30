"use client"
import React, { useState } from "react";
import axios from "axios";

const Signin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  }); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/v1/users/signin", formData,  {withCredentials: true});
      const { token } = res.data;
      // Store the token in local storage
      localStorage.setItem("token", token);
      // if (toke) {
        
      // } else {
        
      // }
      console.log("Signin Response:", res.data);
    } catch (error) {
      console.error("Signin Error:", error.response.data);
    }
  };
  return (
    <div>
    <h2>Signin</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Signin</button>
    </form>
   
  </div>
  );
}

export default Signin;
