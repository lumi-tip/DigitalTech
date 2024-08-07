import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import TechLogin from "./pages/TechLogin"
import TechRegister from "./pages/TechRegister";
import TechUserInterface from "./pages/TechUserInterface";
import NoPage from "./pages/NoPage";
import injectContext from "./store/appContext";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        <Route element={<TechLogin />} path="/" />
                        <Route path="/register" element={<TechRegister />} />
                        <Route path="/interface" element={<TechUserInterface />} />
                        <Route path="*" element={<NoPage />} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
