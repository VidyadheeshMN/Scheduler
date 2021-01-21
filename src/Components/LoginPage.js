import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./LoginPage.css";
import Calendar from "./Calendar";
import { Redirect } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setisLoggedIn] = useState(false);

  function validateForm() {
    return (email.length > 0 && password.length > 0);
  }

  function handleSubmit(event) {
    if((email == "abc@gmail.com" && password == "abc@$123") || (email == "def@gmail.com" && password == "def@$123"))
      setisLoggedIn(!isLoggedIn)
    else{
      alert("Please enter proper email/password")
      setisLoggedIn(false)
    }
  }

  return (
    <div className="Login">
      {isLoggedIn ? <Redirect
                  to={{
                    pathname: "/calendar"
                  }}
                ></Redirect>:<>
      <h1>Event Scheduler</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form></>}
    </div>
  );
}