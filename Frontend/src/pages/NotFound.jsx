
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import UFO from "../assets/UFO404.svg"; // Geholt und gefunden auf: https://lottiefiles.com/free-animation/ufo-404-Nj3rN5178E

function NotFound() {
  return (
    <Container className="py-5 text-center">
      <div className="display-1 fw-bold" style={{ color: "var(--purple)" }}>
        404
      </div>

      <h1 className="h2 fw-bold mt-3">
        Houston, wir haben ein Problem!
      </h1>

      <img
        src={UFO}
        alt="UFO auf Abwegen"
        style={{ width: "300px", maxWidth: "100%", margin: "1rem auto" }}
      />

      <p className="text-body-secondary mb-4">
        Diese Seite ist wohl in eine andere Galaxie abgedriftet.
        Keine Sorge, wir bringen dich zurück in die richtige Umlaufbahn.
      </p>

      <Button as={Link} to="/" variant="primary">
        ← Zurück zur Erde
      </Button>
    </Container>
  );
}

export default NotFound;
