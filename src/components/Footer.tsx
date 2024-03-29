import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Footer = () => {

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="bottom">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                      <Nav.Link href="#home">Demo</Nav.Link>
                  </Nav>
              </Navbar.Collapse>
          </Container>
    </Navbar>
  );

}

export default Footer;