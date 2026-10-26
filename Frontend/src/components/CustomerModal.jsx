
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
} from "react-bootstrap";

const emptyCustomer = {
  name: "",
  email: "",
  telefon: "",
  strasse: "",
  plz: "",
  ort: "",
};

const emptyContact = {
  firstName: "",
  lastName: "",
  role: "",
  email: "",
  telefon: "",
};

function CustomerModal({
  show,
  onHide,
  onSave,
  type = "customer",
  initialData = null,
}) {
  const isContact = type === "contact";
  const [formData, setFormData] = useState(
    isContact ? emptyContact : emptyCustomer,
  );

  useEffect(() => {
    if (!show) return;

    const defaults = isContact ? emptyContact : emptyCustomer;

    setFormData({
      ...defaults,
      ...(initialData ?? {}),
    });
  }, [show, type, initialData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ]),
    );

    onSave(cleanedData);
  }

  const title = isContact
    ? initialData
      ? "Ansprechpartner bearbeiten"
      : "Ansprechpartner hinzufügen"
    : initialData
      ? "Kunden bearbeiten"
      : "Kunden hinzufügen";

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isContact ? (
            <>
              <p className="text-body-secondary small mb-4">
                Erfasse die Kontaktdaten des Ansprechpartners.
              </p>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="contactFirstName">
                    <Form.Label>Vorname *</Form.Label>
                    <Form.Control
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="z. B. Anna"
                      required
                      autoFocus
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="contactLastName">
                    <Form.Label>Nachname *</Form.Label>
                    <Form.Control
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="z. B. Schneider"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="contactRole">
                    <Form.Label>Position / Funktion</Form.Label>
                    <Form.Control
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="z. B. Einkauf"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="contactEmail">
                    <Form.Label>E-Mail</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@unternehmen.de"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="contactPhone">
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                      placeholder="+49 ..."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <p className="text-body-secondary small mb-4">
                Hinterlege die wichtigsten Informationen zum Unternehmen.
              </p>

              <Row className="g-3">
                <Col md={12}>
                  <Form.Group controlId="customerName">
                    <Form.Label>Firmenname *</Form.Label>
                    <Form.Control
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="z. B. Musterbau GmbH"
                      required
                      autoFocus
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="customerEmail">
                    <Form.Label>Allgemeine E-Mail</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="info@unternehmen.de"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="customerPhone">
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                      placeholder="+49 ..."
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="customerStreet">
                    <Form.Label>Straße und Hausnummer</Form.Label>
                    <Form.Control
                      name="strasse"
                      value={formData.strasse}
                      onChange={handleChange}
                      placeholder="Musterstraße 12"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="customerPostalCode">
                    <Form.Label>Postleitzahl</Form.Label>
                    <Form.Control
                      name="plz"
                      value={formData.plz}
                      onChange={handleChange}
                      placeholder="80331"
                    />
                  </Form.Group>
                </Col>

                <Col md={8}>
                  <Form.Group controlId="customerCity">
                    <Form.Label>Ort</Form.Label>
                    <Form.Control
                      name="ort"
                      value={formData.ort}
                      onChange={handleChange}
                      placeholder="München"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          <div className="small text-body-secondary mt-3">
            * Pflichtfeld
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Abbrechen
          </Button>
          <Button type="submit" variant="primary">
            Speichern
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CustomerModal;
