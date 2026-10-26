
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container className="py-5 text-center">
      <div className="display-1 fw-bold" style={{ color: "var(--purple)" }}>
        404
      </div>
      <h1 className="h2 fw-bold mt-3">Diese Seite wurde nicht gefunden.</h1>
      <p className="text-body-secondary mb-4">
        Prüfe die Adresse oder kehre zur Startseite zurück.
      </p>
      <Button as={Link} to="/" variant="primary">
        Zur Startseite
      </Button>
    </Container>
  );
}

export default NotFound;
