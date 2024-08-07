import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { StateProvider } from "./context/StateProvider";
import Routers from "./routers/Routers";
import { ToastContainer } from "react-toastify";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";

import AOS from "aos";
import { AuthProvider } from "./context/AuthContext";
AOS.init({
  duration: 1000,
});
import { registerables } from "chart.js";
import Chart from "chart.js/auto";
Chart.register(...registerables);
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Ho_Chi_Minh");
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StateProvider>
            <BrowserRouter>
              <AuthProvider>
                <Routers />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
                <ToastContainer />
              </AuthProvider>
            </BrowserRouter>
          </StateProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
