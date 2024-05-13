import { ChangeEvent, useEffect, useState } from "react";
import "./index.scss";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Button, Input, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { LS_AUTH_KEY } from "../../constants/Base";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";
import type { NotificationArgsProps } from "antd";
import { UsersClient } from "../../services/clients/UsersClient";
import { RecordsClient } from "../../services/clients/RecordsClient";

type NotificationPlacement = NotificationArgsProps["placement"];

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [api, contextHolder] = notification.useNotification();

  const loginFailed = (message: string, placement: NotificationPlacement) => {
    api.error({
      message,
      placement,
      duration: 2,
    });
  };

  const navigate = useNavigate();
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

  const submitLogin = async () => {
    if (!username || !password) return;

    const { error, errorMessage, response } = await UsersClient.Login({
      username,
      password,
    });

    if (!error) {
      setLocalStorage(LS_AUTH_KEY, response);
      navigate("/");
    }

    if (error) {
      loginFailed(errorMessage, "top");
    }
  };

  const getLoginData = () => {
    const data = getLocalStorage(LS_AUTH_KEY);
    const { username } = data;
    if (username) {
      navigate("/");
      return;
    }
  };

  useEffect(() => {
    getLoginData();
  }, []);

  const getBase = async () => {
    const { error, errorMessage, response } = await RecordsClient.getBase();
    console.log(error, errorMessage, response);
  };

  useEffect(() => {
    getBase();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      {contextHolder}
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
    </>
  );
};

export default Auth;
