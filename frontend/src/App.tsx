import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ConfigProvider } from "antd";

function App() {
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#42b549",
              headerColor: "#ffffff",
            },
          },
          token: {
            // Seed Token
            borderRadius: 4,
            fontFamily: "Plus Jakarta Sans",
            fontSize: 12,
            colorPrimary: "#42b549",
          },
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth type="LOGIN" />} />
            <Route path="/register" element={<Auth type="REGISTER" />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </div>
  );
}

export default App;
