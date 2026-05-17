import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

import App from "./App";

import {
  AuthContextProvider,
  CartContextProvider,
  ProductsContextProvider,
  WishlistContextProvider,
} from "./contexts";



ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthContextProvider>
        <ProductsContextProvider>
          <CartContextProvider>
            <WishlistContextProvider>
              <Router>
                <App />
              </Router>
            </WishlistContextProvider>
          </CartContextProvider>
        </ProductsContextProvider>
      </AuthContextProvider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
