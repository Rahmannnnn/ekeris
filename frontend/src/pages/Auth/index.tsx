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
import logo from "../../assets/images/logo.png";
import ekerisText from "../../assets/images/ekeris-text.png";
import runes from "runes2";

type NotificationPlacement = NotificationArgsProps["placement"];

type AUTH_TYPE = "LOGIN" | "REGISTER";
interface Props {
  type: AUTH_TYPE;
}

const Auth = ({ type }: Props) => {
  const [name, setName] = useState("");
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
      case "name":
        setName(value);
        break;
      case "username":
        setUsername(value.replace(/ /g, ""));
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

  const submitRegister = async () => {
    if (!name || !username || !password) return;

    const { error, errorMessage, response } = await UsersClient.Register({
      name,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      {contextHolder}
      <div className="login">
        <div className="login__form">
          <div className="login__form__logo">
            <img className="logo" src={logo} alt="Logo" />
            <img className="text" src={ekerisText} alt="text" />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (type === "LOGIN") {
                submitLogin();
              }

              if (type === "REGISTER") {
                submitRegister();
              }
            }}
          >
            {type === "REGISTER" && (
              <div className="input">
                <label htmlFor="name">Nama</label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={updateInput}
                  autoComplete="off"
                  suffix={" "}
                />
              </div>
            )}
            <div className="input">
              <label htmlFor="username">Username</label>
              <Input
                count={{
                  show: true,
                  max: 20,
                  strategy: (txt) => runes(txt).length,
                  exceedFormatter: (txt, { max }) =>
                    runes(txt).slice(0, max).join(""),
                }}
                id="username"
                name="username"
                value={username}
                onChange={updateInput}
                autoComplete="off"
                suffix={" "}
              />
            </div>
            <div className="input">
              <label htmlFor="password">Kata Sandi</label>
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
            {type === "LOGIN" && (
              <>
                <Button type="primary" htmlType="submit">
                  MASUK
                </Button>
                <p className="register__button">
                  Belum punya akun? <a href="/register">Daftar</a>
                </p>
              </>
            )}

            {type === "REGISTER" && (
              <>
                <Button type="primary" htmlType="submit">
                  DAFTAR
                </Button>
                <p className="register__button">
                  Sudah punya akun? <a href="/login">Masuk</a>
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Auth;
