import React from 'react';
import logo from './logo.svg';
import './App.css';

import NavigationBar from './components/NavigationBar';

import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Welcome from './components/Welcome';
import Footer from './components/Footer';
import Person from './components/Person';
import PersonList from './components/PersonList';

export default function App() {

  const marginTop={
    marginTop:"20px"
  };

  const heading = "Welcome to Famous Persons";
  const desc = "well-known. A well-known person or thing is known about by a lot of people and is therefore famous or familiar. If someone is well-known for a particular activity, a lot of people know about them because of their involvement with that activity.";
  const footer = "Gadsred";
  return (
    <Router>
      <NavigationBar />
      <Container>
        <Row>
          <Col lg={12} style={marginTop}>
              <Switch>
                  <Route path="/" exact component={() => <Welcome heading={heading} desc={desc} footer={footer}/>}/>
                  <Route path="/add" exact component={Person}/>
                  <Route path="/edit/:id" exact component={Person}/>
                  <Route path="/list" exact component={PersonList}/>
              </Switch>
              
              
          </Col>
        </Row>
      </Container>
      <Footer/>


    </Router>
  );
}

