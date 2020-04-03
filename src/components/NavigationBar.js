import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NavigationBar() {
   
        return (
            <Navbar bg="dark" variant="dark">
                <Link to={""} className="navbar-brand">
                    Famous Persons
                </Link>
                
                <Nav className="mr-auto">
                    <Link to={"add"} className="nav-link">Add Person</Link>
                    <Link to={"list"} className="nav-link">Person List</Link>
                </Nav>
            </Navbar>
        );
   
}

