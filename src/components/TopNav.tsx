import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import ConfigurationButton from './ConfigurationButton';
import SignInAccountButton from './SignInAccountButton';
import RegionFilterButton from './RegionFilterButton';
import '../App.css';

const TopNav = () => {

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
    <Container>
      <Navbar.Brand href="#home">Azure Diagrammer</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
      <Container>

      <Navbar.Collapse id="basic-navbar-nav">

        <Navbar.Collapse className="justify-content-end">
          <SignInAccountButton />
        </Navbar.Collapse>
      </Navbar.Collapse>

      <Navbar.Collapse className="navbar-row-2" id="basic-navbar-nav">

        <span className="navbar-row-2-label">Connection:</span>
          <ConfigurationButton />
            
        <Navbar.Collapse>
          <span className="navbar-row-2-spacer"></span>
          <span className="navbar-row-2-label">Regions:</span>
          <RegionFilterButton />
        </Navbar.Collapse>
            
        <Navbar.Collapse className="justify-content-end">
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              size="sm"
            />
            <Button variant="outline-success" size='sm'>Search</Button>
          </Form>
        </Navbar.Collapse>

      </Navbar.Collapse>

      </Container>

    </Container>
  </Navbar>
  )

}

export default TopNav;