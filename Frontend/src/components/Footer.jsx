
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
            Kundenverwaltung von{" "}
            <a
                href="https://de.linkedin.com/in/julian-lingnau-05b623162"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
            >
                Julian Lingnau
            </a>{" "}
            © {new Date().getFullYear()} Octoja
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
