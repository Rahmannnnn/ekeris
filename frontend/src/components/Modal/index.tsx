import { ReactNode } from "react";
import "./index.scss";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  closeButton?: boolean;
  close: () => void;
}

const Modal = ({ children, isOpen, close }: Props) => {
  return (
    <div
      className="modal"
      style={{ visibility: isOpen ? "visible" : "hidden" }}
    >
      <div
        className="content"
        style={{
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
      <div className="overlay" onClick={() => close()}></div>
    </div>
  );
};

export default Modal;
