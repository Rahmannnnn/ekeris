import "./index.scss";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <div className="layout__navbar">
        <div className="layout__navbar__container">
          <h1>E-KERIS</h1>
          <div className="layout__navbar__action">
            <p>KELUAR</p>
          </div>
        </div>
      </div>
      <div className="layout__content">{children}</div>
    </div>
  );
};

export default Layout;
