import { ChangeEvent, useState } from "react";
import "./index.scss";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Button, Input } from "antd";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const updateInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const submitLogin = () => {
    console.log(username, password);
    if (!username || !password) return;
  };

  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="login">
      <div className="login__form">
        <h1>e-KERIS</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitLogin();
          }}
        >
          <div className="input">
            <label htmlFor="username">Username</label>
            <Input
              id="username"
              name="username"
              value={username}
              onChange={updateInput}
              autoComplete="off"
              suffix={" "}
            />
          </div>
          <div className="input">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={updateInput}
              suffix={
                !showPassword ? (
                  <FaEye onClick={() => setShowPassword(true)} />
                ) : (
                  <FaEyeSlash onClick={() => setShowPassword(false)} />
                )
              }
            />
          </div>
          <Button type="primary" htmlType="submit">
            LOGIN
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
