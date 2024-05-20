import { Button, Modal } from "antd";
import "./index.scss";
import { ReactNode, useState } from "react";
import { deleteLocalStorage } from "../../utils/localStorage";
import { LS_AUTH_KEY } from "../../constants/Base";
import { useNavigate } from "react-router-dom";
import ekerisLogo from "../../assets/images/ekeris-logo.png";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const logout = () => {
    deleteLocalStorage(LS_AUTH_KEY);
    navigate("/login");
  };

  return (
    <div className="layout">
      <div className="layout__navbar">
        <div className="layout__navbar__container">
          <div className="logo">
            <img className="text" src={ekerisLogo} alt="text" />
          </div>
          <div className="layout__navbar__action">
            <Button onClick={() => setShowModal(true)}>KELUAR</Button>
          </div>
        </div>
      </div>
      <div className="layout__content">{children}</div>

      <Modal
        onCancel={() => setShowModal(false)}
        open={showModal}
        footer={[
          <Button key="cancel" onClick={() => setShowModal(false)}>
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
    </div>
  );
};

export default Layout;
