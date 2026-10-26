
import {
  Container,
  Nav,
  Navbar as BootstrapNavbar,
} from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <BootstrapNavbar expand="lg" className="app-navbar">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="brand">
          <span className="brand-mark">O</span>
          <span>Octoja</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="octoja-nav" />

        <BootstrapNavbar.Collapse id="octoja-nav">
          <Nav className="ms-auto align-items-lg-center gap-lg-2">
            <Nav.Link as={NavLink} to="/" end>
              Startseite
            </Nav.Link>

            <Nav.Link as={NavLink} to="/verwaltung">
              Verwaltung
            </Nav.Link>

            <Nav.Link as={Link} to="/verwaltung" className="nav-cta">
              Zur Verwaltung <span aria-hidden="true">→</span>
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
