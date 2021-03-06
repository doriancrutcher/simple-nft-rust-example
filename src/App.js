import "regenerator-runtime/runtime";
import React, { useContext, useEffect, useState } from "react";
import { login, logout } from "./utils";
import "./global.css";
import "bootstrap/dist/css/bootstrap.min.css";

import getConfig from "/config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

// NPM Tools
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Nav, Navbar, Container, NavDropdown, Row } from "react-bootstrap";

//Assets
import NEARIcon from "./assets/near_icon 1.svg";
import SimpleSign from "./assets/simple.svg";

// Local Tools
import { appStore, onAppMount } from "./state/app";
import { loadItems } from "./state/views";

//Components
import LoginPage from "./Components/LoginPage";
import CanvasPage from "./Components/CanvasPage";

// import CanvasPage from "./Components/CanvasPage.js";

export default function App() {
  // State variables

  useEffect(() => {
    const getItems = async () => {
      console.log(await loadItems(window.account));
    };

    getItems();
  }, []);

  return (
    <Router>
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand href='#home'>
            <img src={NEARIcon}></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='me-auto'></Nav>
            <Nav>
              <Nav.Link onClick={window.accountId === "" ? login : logout}>
                {window.accountId === "" ? "Login" : window.accountId}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Row>
          <img src={SimpleSign}></img>
        </Row>
        <Row>
          <Switch>
            {/* <Route>
              {" "}
              <LoginPage />
            </Route> */}
            <Route>
              <CanvasPage />
            </Route>
            {/* <Route><NFTView /></Route> */}
          </Switch>
        </Row>
      </Container>
    </Router>
  );
}
