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
      <Navbar.Brand href="#home">Azure Diagrammer</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
      <Container>

          <Navbar.Collapse id="basic-navbar-nav">
            
          <SearchBar />

        <Navbar.Collapse className="justify-content-end">
          <SignInAccountButton />
        </Navbar.Collapse>
      </Navbar.Collapse>

      <Navbar.Collapse className="navbar-row-2" id="basic-navbar-nav">


          <span className="navbar-row-2-label">Connection:</span>
          <ConfigurationButton />
          <span className="navbar-row-2-spacer"></span>
          <span className="navbar-row-2-label">Regions:</span>
          <RegionFilterButton />

            
      </Navbar.Collapse>

      </Container>

    </Container>
  </Navbar>
  )

}

export default TopNav;