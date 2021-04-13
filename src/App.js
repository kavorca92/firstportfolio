import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './App.css';


import Footer from './components/Footer.js';
import HomePage from './pages/HomePage.js';
import AboutPage from './pages/AboutPage.js';
import ContactPage from './pages/Contactpage.js';
import WeatherPage from "./pages/WeatherPage.js";




class App extends React.Component {
  
constructor(props) {
  super(props);
  this.state = {
    title: 'Nisse Lindqvist',
    headerLinks: [
      { title: 'Home', path :'/'},
      { title: 'About', path :'/about'},
      { title: 'Contact', path :'/contact'},
      { title: 'Weather', path :'/weather'}
    ],
    home: {
      title: 'Nisses Portfolio',
      subTitle: 'Learning javascript and React!',
      text: 'See my projects below!'
    },
    about: {
      title: 'About me'
    },
    contact: {
      title: 'Where to find me'
    },
    weather: {
      title: 'Weatherapp'
    }
  }
}

  render(){
    return (
      <Router>
        <Container className='p=0' fluid={true}>

          <Navbar className="border-bottom" bg="transparent" expand="lg">
            <Navbar.Brand>Nisse Lindqvist</Navbar.Brand>

            <Navbar.Toggle className="border-0" aria-controls='navbar-toggle'/>
            <Navbar.Collapse id="navbar-toggle">
              <Nav className="ml-auto">
                <Link className='nav-link' to="/">Home</Link>
                <Link className='nav-link' to="/about">About</Link>
                <Link className='nav-link' to="/contact">Contact</Link>
                <Link className='nav-link' to="/weather">Weather</Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Route path="/" exact render={() => <HomePage title={this.state.home.title} subTitle={this.state.home.subTitle} text={this.state.home.text} />} />
          <Route path="/about" render={() => <AboutPage title={this.state.about.title}/>} />
          <Route path="/contact" render={() => <ContactPage title={this.state.contact.title} />} />
          <Route path="/weather" render={() => <WeatherPage title={this.state.weather.title} />} />
          <Footer/>
        </Container>

      </Router>
    
    );
  }
}

export default App;
