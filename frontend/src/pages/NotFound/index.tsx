import { Button } from "antd";
import "./index.scss";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const back = () => {
    navigate("/");
  };
  return (
    <div className="notfound">
      <h1>404: Halaman tidak ditemukan :(</h1>
      <Button onClick={back}>Kembali</Button>
    </div>
  );
};

export default NotFound;
