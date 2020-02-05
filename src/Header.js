import React from 'react';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { logout } from './App'

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

Amplify.configure(awsmobile);

// ヘッダーコンポーネント
export const Header = () => {

  const logoutClick = e => {
    e.preventDefault();
    logout();
  }

  return(
    <header>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">photo translation</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Upload</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4" onClick={logoutClick}>log out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
      </Navbar>
    </header>
  )
}
