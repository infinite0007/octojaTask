
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="app-footer">
      <Container className="footer-inner">
        <div>
          <Link to="/" className="footer-brand">
            <span className="brand-mark">O</span>
            Octoja
          </Link>
          <p className="footer-note">
            Kunden und Ansprechpartner. Einfach organisiert.
          </p>
        </div>

        <div className="footer-copy">
          Kundenverwaltung von Julian Lingnau © {new Date().getFullYear()} Octoja
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
