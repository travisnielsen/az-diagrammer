import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import ConfigurationButton from './ConfigurationButton';
import SignInAccountButton from './SignInAccountButton';
import RegionFilterButton from './RegionFilterButton';
import SearchBar from './SearchBar';
import '../App.css';

const TopNav = () => {

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" /> 
        <Container>
          <Navbar.Collapse id="basic-navbar-nav">
            <Navbar.Brand href="#home">AZD</Navbar.Brand>              
            <SearchBar />
            <span className="navbar-row-1-spacer"></span>
            <span className="navbar-row-1-label">Diagram:</span>
            <ConfigurationButton />
            <Navbar.Collapse className="justify-content-end">
              <SignInAccountButton />
            </Navbar.Collapse>
          </Navbar.Collapse>
          <Navbar.Collapse className="navbar-row-2" id="basic-navbar-nav">
              <Navbar.Collapse className="justify-content-end">
                <span className="navbar-row-2-label">Regions:</span>
                <RegionFilterButton />
              </Navbar.Collapse>
          </Navbar.Collapse>
        </Container>
      </Container>
    </Navbar>
  )

}

export default TopNav;