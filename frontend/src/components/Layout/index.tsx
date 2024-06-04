import {
  Button,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Tabs,
  TabsProps,
  notification,
} from "antd";
import "./index.scss";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import {
  deleteLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "../../utils/localStorage";
import { LS_AUTH_KEY } from "../../constants/Base";
import { useNavigate } from "react-router-dom";
import ekerisLogo from "../../assets/images/ekeris-logo.png";
import { UsersClient } from "../../services/clients/UsersClient";
import { IoIosArrowDown } from "react-icons/io";
import runes from "runes2";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface LayoutProps {
  children: ReactNode;
}

interface UserInterface {
  name: string;
  username: string;
}

type MODAL_TYPE = "LOGOUT" | "USERNAME" | "PASSWORD";

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInterface>({
    name: "",
    username: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<MODAL_TYPE>("LOGOUT");

  interface UserInputInterface extends UserInterface {
    password: string;
  }

  const [editableUser, setEditableUser] = useState<UserInputInterface>({
    username: "",
    name: "",
    password: "",
  });

  interface PasswordInputInterface {
    old: string;
    new: string;
    confirmation: string;
  }

  const [editablePassword, setEditablePassword] =
    useState<PasswordInputInterface>({
      old: "",
      new: "",
      confirmation: "",
    });

  interface PasswordInputTypeInterface {
    old: boolean;
    new: boolean;
    confirmation: boolean;
  }
  const [editablePasswordType, setEditablePasswordType] =
    useState<PasswordInputTypeInterface>({
      old: false,
      new: false,
      confirmation: false,
    });

  const getUser = async () => {
    const userLS = getLocalStorage(LS_AUTH_KEY);

    const { error, response } = await UsersClient.GetUser(userLS.username);
    if (error) {
      logout();
    } else {
      setUser(response);
      setEditableUser({
        ...response,
        password: "",
      });
    }
  };

  useEffect(() => {
    getUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedTab, setSelectedTab] = useState("1");
  const changeSelectedTab = (value: string) => {
    setSelectedTab(value);
  };

  const updateInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    switch (name) {
      case "name":
      case "password":
        setEditableUser({ ...editableUser, [name]: value.toString() });
        break;
      case "username":
        setEditableUser({
          ...editableUser,
          username: value.toString().replace(/ /g, ""),
        });
        break;
    }
  };

  const updatePasswordInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setEditablePassword({ ...editablePassword, [name]: value.toString() });
  };

  const updatePasswordEdit = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setPassword({ ...password, password: value.toString() });
  };

  const editTabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "PROFIL",
      children: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="modal__edit__row">
            <div className="title">Nama</div>
            <div className="desc">
              <Input
                name="name"
                autoComplete="off"
                value={editableUser.name}
                onChange={updateInput}
              />
            </div>
          </div>
          <div className="modal__edit__row">
            <div className="title">Username</div>
            <div className="desc">
              <Input
                count={{
                  show: true,
                  max: 20,
                  strategy: (txt) => runes(txt).length,
                  exceedFormatter: (txt, { max }) =>
                    runes(txt).slice(0, max).join(""),
                }}
                name="username"
                autoComplete="off"
                value={editableUser.username}
                onChange={updateInput}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "PASSWORD",
      children: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="modal__edit__row">
            <div className="title">Password Lama</div>
            <div className="desc">
              <Input
                type={editablePasswordType.old ? "text" : "password"}
                suffix={
                  !editablePasswordType.old ? (
                    <FaEye
                      cursor={"pointer"}
                      onClick={() =>
                        setEditablePasswordType({
                          ...editablePasswordType,
                          old: true,
                        })
                      }
                    />
                  ) : (
                    <FaEyeSlash
                      cursor={"pointer"}
                      onClick={() =>
                        setEditablePasswordType({
                          ...editablePasswordType,
                          old: false,
                        })
                      }
                    />
                  )
                }
                name="old"
                autoComplete="off"
                value={editablePassword.old}
                onChange={updatePasswordInput}
              />
            </div>
          </div>
          <div className="modal__edit__row">
            <div className="title">Password Baru</div>
            <div className="desc">
              <Input
                type={editablePasswordType.new ? "text" : "password"}
                suffix={
                  !editablePasswordType.new ? (
                    <FaEye
                      cursor={"pointer"}
                      onClick={() =>
                        setEditablePasswordType({
                          ...editablePasswordType,
                          new: true,
                        })
                      }
                    />
                  ) : (
                    <FaEyeSlash
                      cursor={"pointer"}
                      onClick={() =>
                        setEditablePasswordType({
                          ...editablePasswordType,
                          new: false,
                        })
                      }
                    />
                  )
                }
                name="new"
                autoComplete="off"
                value={editablePassword.new}
                onChange={updatePasswordInput}
              />
            </div>
          </div>
          <div className="modal__edit__row">
            <div className="title">Konfirmasi Password Baru</div>
            <div className="desc">
              <Input
                type={editablePasswordType.confirmation ? "text" : "password"}
                suffix={
                  !editablePasswordType.confirmation ? (
                    <FaEye
                      cursor={"pointer"}
                      onClick={() =>
                        setEditablePasswordType({
                          ...editablePasswordType,
                          confirmation: true,
                        })
                      }
                    />
                  ) : (
                    <FaEyeSlash
                      cursor={"pointer"}
                      onClick={() =>
                        setEditablePasswordType({
                          ...editablePasswordType,
                          confirmation: false,
                        })
                      }
                    />
                  )
                }
                name="confirmation"
                autoComplete="off"
                value={editablePassword.confirmation}
                onChange={updatePasswordInput}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  interface InputPassword {
    password: string;
    type: boolean;
  }

  const [password, setPassword] = useState<InputPassword>({
    password: "",
    type: false,
  });

  const handleEditProfile = async () => {
    //selected = 1
    if (selectedTab === "1") {
      setShowModal(false);
      openModal("PASSWORD");
    } else {
      await changePassword();
    }
    // selected = 2
    // submit
  };

  const logout = () => {
    deleteLocalStorage(LS_AUTH_KEY);
    navigate("/login");
  };

  const openModal = (type: MODAL_TYPE) => {
    if (type === "USERNAME") {
      setEditableUser({ ...user, password: "" });
    }

    setModalType(type);
    setShowModal(true);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <p onClick={() => openModal("USERNAME")}>Edit Profil</p>,
    },
  ];

  const closeModal = () => {
    setModalType("LOGOUT");
    setEditableUser({
      username: "",
      name: "",
      password: "",
    });

    setPassword({
      password: "",
      type: false,
    });

    setSelectedTab("1");
    setEditablePassword({
      old: "",
      new: "",
      confirmation: "",
    });

    setEditablePasswordType({
      old: false,
      new: false,
      confirmation: false,
    });

    setShowModal(false);
  };

  const changeProfile = async () => {
    const { error, errorMessage, response } = await UsersClient.UpdateProfile(
      user.username,
      {
        ...editableUser,
        password: password.password,
      }
    );

    if (error) {
      api.error({
        message: errorMessage,
        placement: "top",
        duration: 2,
      });
    } else {
      deleteLocalStorage(LS_AUTH_KEY);
      setLocalStorage(LS_AUTH_KEY, { ...response });
      await getUser();

      api.success({
        message: "Profil berhasil diubah.",
        placement: "top",
        duration: 2,
      });
    }

    closeModal();
  };

  const changePassword = async () => {
    const body = {
      oldPassword: editablePassword.old,
      newPassword: editablePassword.new,
    };

    const { error, errorMessage } = await UsersClient.UpdatePassword(
      user.username,
      body
    );

    if (error) {
      api.error({
        message: errorMessage,
        placement: "top",
        duration: 2,
      });
    } else {
      api.success({
        message: "Password berhasil diubah.",
        placement: "top",
        duration: 2,
      });
    }

    closeModal();
  };

  const [api, contextHolder] = notification.useNotification();

  return (
    <>
      {contextHolder}
      <div className="layout">
        <div className="layout__navbar">
          <div className="layout__navbar__container">
            <div className="logo">
              <img className="text" src={ekerisLogo} alt="text" />
            </div>
            <div className="layout__navbar__action">
              <Dropdown menu={{ items }} placement="bottomRight">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                    cursor: "pointer",
                  }}
                >
                  <p>Hi, {user.name}</p>
                  <IoIosArrowDown />
                </div>
              </Dropdown>
              <Button onClick={() => openModal("LOGOUT")}>KELUAR</Button>
            </div>
          </div>
        </div>
        <div className="layout__content">{children}</div>

        {modalType === "LOGOUT" && (
          <Modal
            onCancel={() => closeModal()}
            open={showModal}
            footer={[
              <Button key="cancel" onClick={() => closeModal()}>
                BATAL
              </Button>,
              <Button key="save" type="primary" onClick={logout}>
                KELUAR
              </Button>,
            ]}
          >
            <div className="modal__logout">
              <p>Apakah anda yakin ingin keluar?</p>
            </div>
          </Modal>
        )}

        {modalType === "USERNAME" && (
          <Modal
            title="EDIT PROFIL"
            onCancel={() => closeModal()}
            open={showModal}
            footer={[
              <Button key="cancel" onClick={() => closeModal()}>
                BATAL
              </Button>,
              <Button
                disabled={
                  (selectedTab === "2" &&
                    (editablePassword.old === "" ||
                      editablePassword.new === "" ||
                      editablePassword.confirmation === "" ||
                      editablePassword.new !==
                        editablePassword.confirmation)) ||
                  (selectedTab === "1" &&
                    (editableUser.name === "" || editableUser.username === ""))
                }
                key="save"
                type="primary"
                onClick={handleEditProfile}
              >
                {selectedTab === "1" ? "UBAH PROFIL" : "UBAH PASSWORD"}
              </Button>,
            ]}
          >
            <div className="modal__edit">
              <Tabs
                activeKey={selectedTab}
                defaultActiveKey="1"
                items={editTabItems}
                onChange={changeSelectedTab}
              />
            </div>
          </Modal>
        )}

        {modalType === "PASSWORD" && (
          <Modal
            title="MASUKKAN PASSWORD"
            onCancel={() => closeModal()}
            open={showModal}
            footer={[
              <Button key="cancel" onClick={() => closeModal()}>
                BATAL
              </Button>,
              <Button
                disabled={password.password === ""}
                key="save"
                type="primary"
                onClick={changeProfile}
              >
                UBAH PROFIL
              </Button>,
            ]}
          >
            <div className="modal__password">
              <div className="modal__password__row">
                <div className="desc">
                  <Input
                    type={password.type ? "text" : "password"}
                    suffix={
                      !password.type ? (
                        <FaEye
                          cursor={"pointer"}
                          onClick={() =>
                            setPassword({
                              ...password,
                              type: true,
                            })
                          }
                        />
                      ) : (
                        <FaEyeSlash
                          cursor={"pointer"}
                          onClick={() =>
                            setPassword({
                              ...password,
                              type: false,
                            })
                          }
                        />
                      )
                    }
                    autoComplete="off"
                    value={password.password}
                    onChange={updatePasswordEdit}
                  />
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Layout;
