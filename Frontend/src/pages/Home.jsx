
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "01",
    title: "Kunden verwalten",
    description:
      "Kunden zentral erfassen, Kontaktdaten pflegen und Informationen jederzeit wiederfinden.",
  },
  {
    icon: "02",
    title: "Ansprechpartner zuordnen",
    description:
      "Jedem Kunden können mehrere Ansprechpartner mit eigenen Kontaktdaten zugeordnet werden.",
  },
  {
    icon: "03",
    title: "Einfach den Überblick behalten",
    description:
      "Mit Suche, übersichtlichen Listen und klaren Kundenbeziehungen schnell zum gewünschten Eintrag.",
  },
];

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Kundenverwaltung, neu gedacht
              </div>

              <h1>
                Gute Beziehungen beginnen mit
                <span> dem Überblick.</span>
              </h1>

              <p className="hero-description">
                Mit der Octoja-Kundenverwaltung verwaltest du Kunden und ihre Ansprechpartner
                zentral an einem Ort. Einfach strukturiert, übersichtlich
                gestaltet und auf das Wesentliche konzentriert.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Button
                  as={Link}
                  to="/verwaltung"
                  variant="primary"
                  size="lg"
                  className="hero-button"
                >
                  Jetzt zur Verwaltung <span aria-hidden="true">→</span>
                </Button>

                <Button
                  href="#funktionen"
                  variant="outline-secondary"
                  size="lg"
                >
                  Funktionen entdecken
                </Button>
              </div>

              <div className="hero-note mt-4">
                <span aria-hidden="true">✓</span>
                Kunden und Ansprechpartner an einem Ort
              </div>
            </Col>

            <Col lg={5}>
              <div className="hero-visual">
                <div className="visual-orbit orbit-one" />
                <div className="visual-orbit orbit-two" />

                <Card className="visual-card">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div>
                        <div className="visual-overline">DEIN ARBEITSBEREICH</div>
                        <h2 className="h5 fw-bold mt-2 mb-0">
                          Kundenübersicht
                        </h2>
                      </div>
                      <span className="visual-symbol">O</span>
                    </div>

                    <div className="visual-search">
                      <span aria-hidden="true">⌕</span>
                      Kunden suchen ...
                    </div>

                    <div className="visual-customer">
                      <div className="visual-avatar avatar-purple">MB</div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">Musterbau GmbH</div>
                        <div className="visual-muted">München</div>
                      </div>
                      <span className="visual-status">Aktiv</span>
                    </div>

                    <div className="visual-contact">
                      <div className="visual-avatar avatar-blue">TS</div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">Tech Solutions GmbH</div>
                        <div className="visual-muted">Stuttgart</div>
                      </div>
                      <span className="visual-arrow">→</span>
                    </div>

                    <div className="visual-footer">
                      <span className="visual-footer-dot" />
                      Beispiel einer Kundenliste
                    </div>
                  </Card.Body>
                </Card>

                <div className="floating-note">
                  <span className="floating-note-icon">↗</span>
                  <div>
                    <div className="fw-bold">Klar strukturiert</div>
                    <div className="visual-muted">Kunde → Ansprechpartner</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="funktionen" className="features-section">
        <Container>
          <div className="section-intro text-center">
            <div className="eyebrow">Weniger Aufwand. Mehr Übersicht.</div>
            <h2>Alles Wichtige an einem Ort.</h2>
            <p>
              Die Funktionen, die du für eine übersichtliche Kundenverwaltung
              wirklich brauchst.
            </p>
          </div>

          <Row className="g-4">
            {features.map((feature) => (
              <Col md={6} lg={4} key={feature.title}>
                <Card className="feature-card h-100">
                  <Card.Body className="p-4 p-lg-4">
                    <div className="feature-number">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="relationship-section">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <div className="eyebrow">Saubere Datenstruktur</div>
              <h2>Ein Kunde. Mehrere Ansprechpartner.</h2>
              <p>
                Jeder Ansprechpartner gehört genau zu einem Kunden. So bleiben
                Kontaktinformationen zugeordnet und Kundenbeziehungen klar
                nachvollziehbar.
              </p>
            </Col>

            <Col lg={5}>
              <div className="relationship-card">
                <div className="relationship-node main-node">
                  <span className="relationship-icon">▤</span>
                  <div>
                    <div className="fw-bold">Kunde</div>
                    <div className="visual-muted">Musterbau GmbH</div>
                  </div>
                </div>

                <div className="relationship-connector">
                  <span>1</span>
                  <div />
                  <span>N</span>
                </div>

                <div className="relationship-children">
                  <div className="relationship-node">
                    <span className="relationship-icon">♙</span>
                    <div>
                      <div className="fw-bold">Anna Schneider</div>
                      <div className="visual-muted">Geschäftsführung</div>
                    </div>
                  </div>

                  <div className="relationship-node">
                    <span className="relationship-icon">♙</span>
                    <div>
                      <div className="fw-bold">Markus Weber</div>
                      <div className="visual-muted">Einkauf</div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="home-cta">
        <Container>
          <div className="cta-panel">
            <div>
              <div className="eyebrow">Bereit?</div>
              <h2>Bring Ordnung in deine Kundenkontakte.</h2>
              <p>Starte direkt mit der Verwaltung deiner Kunden.</p>
            </div>
            <Button
              as={Link}
              to="/verwaltung"
              variant="light"
              size="lg"
              className="cta-button"
            >
              Zur Verwaltung <span aria-hidden="true">→</span>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default Home;
