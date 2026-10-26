
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";

import CustomerModal from "../components/CustomerModal";
import { api } from "../services/api";

function Verwaltung() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState({
    show: false,
    type: "customer",
    initialData: null,
  });

  // Kunden beim Öffnen der Seite aus der Datenbank laden
  async function loadCustomers() {
    const data = await api.getCustomers();
    setCustomers(data);
    return data;
  }

  useEffect(() => {
    async function initialize() {
      try {
        const data = await loadCustomers();

        if (data.length > 0) {
          setSelectedCustomerId(data[0].id);
        }
      } catch (err) {
        setError(
          `Kunden konnten nicht geladen werden: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return customers;

    return customers.filter((customer) => {
      const searchable = [
        customer.name,
        customer.email,
        customer.telefon,
        customer.ort,
        customer.plz,
        ...(customer.contacts ?? []).flatMap((contact) => [
          contact.firstName,
          contact.lastName,
          contact.email,
          contact.role,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(term);
    });
  }, [customers, search]);

  const selectedCustomer =
    customers.find(
      (customer) => customer.id === selectedCustomerId
    ) ?? null;

  function openModal(type, initialData = null) {
    setError("");
    setModal({ show: true, type, initialData });
  }

  function closeModal() {
    setModal((current) => ({ ...current, show: false }));
  }

  // Kunden und Ansprechpartner über die API speichern
  async function saveCustomerOrContact(formData) {
    const { type, initialData } = modal;

    setSaving(true);
    setError("");

    try {
      if (type === "customer") {
        let savedCustomer;

        if (initialData) {
          savedCustomer = await api.updateCustomer(
            initialData.id,
            formData
          );
        } else {
          savedCustomer = await api.createCustomer(formData);
        }

        const updatedCustomers = await loadCustomers();

        setSelectedCustomerId(
          savedCustomer.id ??
          initialData?.id ??
          updatedCustomers[0]?.id ??
          null
        );
      } else {
        if (selectedCustomerId === null) {
          throw new Error("Bitte zuerst einen Kunden auswählen.");
        }

        if (initialData) {
          await api.updateContact(initialData.id, formData);
        } else {
          await api.createContact(selectedCustomerId, formData);
        }

        await loadCustomers();
      }

      closeModal();
    } catch (err) {
      setError(`Speichern fehlgeschlagen: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  // Kunden löschen
  async function deleteCustomer(customer) {
    const confirmed = window.confirm(
      `Möchtest du den Kunden „${customer.name}“ wirklich löschen? Seine Ansprechpartner werden ebenfalls gelöscht.`
    );

    if (!confirmed) return;

    setError("");

    try {
      await api.deleteCustomer(customer.id);

      const updatedCustomers = await loadCustomers();

      if (selectedCustomerId === customer.id) {
        setSelectedCustomerId(updatedCustomers[0]?.id ?? null);
      }
    } catch (err) {
      setError(`Löschen fehlgeschlagen: ${err.message}`);
    }
  }

  // Ansprechpartner löschen
  async function deleteContact(contact) {
    const confirmed = window.confirm(
      `Möchtest du ${contact.firstName} ${contact.lastName} wirklich löschen?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await api.deleteContact(contact.id);
      await loadCustomers();
    } catch (err) {
      setError(`Löschen fehlgeschlagen: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <Container className="py-5">
        <p>Kundendaten werden geladen ...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4 py-lg-5">
      <div className="mb-4">
        <div>
          <div className="eyebrow">ARBEITSBEREICH</div>
          <h1 className="mt-2">Kundenverwaltung</h1>
          <p className="text-body-secondary mb-0">
            Verwalte deine Kunden und die zugehörigen Ansprechpartner an einem Ort.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => openModal("customer")}
          className="mt-3 mt-lg-0"
          disabled={saving}
        >
          <span aria-hidden="true">＋ </span>Kunde hinzufügen
        </Button>
      </div>

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {saving && (
        <Alert variant="info">
          Änderungen werden gespeichert ...
        </Alert>
      )}

      <Row className="g-3 mb-4">
        <Col sm={6} lg={4}>
          <Card className="h-100">
            <Card.Body>
              <div>Kunden insgesamt</div>
              <div>{customers.length}</div>
              <div className="small text-body-secondary">
                Erfasste Unternehmen
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} lg={4}>
          <Card className="h-100">
            <Card.Body>
              <div>Ansprechpartner</div>
              <div>
                {customers.reduce(
                  (total, customer) =>
                    total + (customer.contacts?.length ?? 0),
                  0
                )}
              </div>
              <div className="small text-body-secondary">
                Kundenbezogene Kontakte
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={4}>
          <Card className="h-100">
            <Card.Body className="p-3 p-lg-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h5 fw-bold mb-0">Deine Kunden</h2>
                <Badge bg="secondary" pill>
                  {filteredCustomers.length}
                </Badge>
              </div>

              <InputGroup className="mb-3">
                <InputGroup.Text aria-hidden="true">
                </InputGroup.Text>
                <Form.Control
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Kunden suchen ..."
                  aria-label="Kunden suchen"
                />
              </InputGroup>

              <div className="customer-list">
                {filteredCustomers.length === 0 ? (
                  <div className="py-4 text-center">
                    <div className="fs-3 mb-2">⌕</div>
                    <div className="fw-semibold">
                      Keine Kunden gefunden
                    </div>
                    <div className="small text-body-secondary mt-1">
                      Ändere deinen Suchbegriff oder lege einen Kunden an.
                    </div>
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <button
                      type="button"
                      key={customer.id}
                      className="customer-row"
                      onClick={() => setSelectedCustomerId(customer.id)}
                    >
                      <span>
                        {customer.name} in{" "}
                        {customer.ort || "Kein Ort angegeben"}
                      </span>
                    </button>
                  ))
                )}
              </div>

              <Button
                variant="outline-primary"
                className="w-100 mt-3"
                onClick={() => openModal("customer")}
                disabled={saving}
              >
                ＋ Weiteren Kunden anlegen
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {!selectedCustomer ? (
            <Card className="h-100">
              <Card.Body className="text-center py-5">
                <h2 className="h5 fw-bold">
                  Noch kein Kunde ausgewählt
                </h2>
                <p className="text-body-secondary">
                  Wähle links einen Kunden aus oder lege einen neuen an.
                </p>
                <Button
                  variant="primary"
                  onClick={() => openModal("customer")}
                  disabled={saving}
                >
                  Ersten Kunden anlegen
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <>
              <Card className="mb-4">
                <Card.Body className="p-3 p-lg-4">
                  <div className="d-flex flex-wrap justify-content-between gap-3">
                    <div>
                      <div className="small text-body-secondary mb-1">
                        KUNDENPROFIL
                      </div>
                      <h2 className="h4 fw-bold mb-1">
                        {selectedCustomer.name}
                      </h2>
                      <div className="text-body-secondary small">
                        {[
                          selectedCustomer.strasse,
                          [
                            selectedCustomer.plz,
                            selectedCustomer.ort,
                          ]
                            .filter(Boolean)
                            .join(" "),
                        ]
                          .filter(Boolean)
                          .join(", ") || "Keine Adresse hinterlegt"}
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        disabled={saving}
                        onClick={() =>
                          openModal("customer", selectedCustomer)
                        }
                      >
                        Bearbeiten
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        disabled={saving}
                        onClick={() => deleteCustomer(selectedCustomer)}
                      >
                        Löschen
                      </Button>
                    </div>
                  </div>

                  <Row className="g-3 mt-3">
                    <Col md={6}>
                      <div>E-Mail</div>
                      <div>
                        {selectedCustomer.email ? (
                          <a href={`mailto:${selectedCustomer.email}`}>
                            {selectedCustomer.email}
                          </a>
                        ) : (
                          "Nicht angegeben"
                        )}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div>Telefon</div>
                      <div>
                        {selectedCustomer.telefon || "Nicht angegeben"}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body className="p-3 p-lg-4">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                    <div>
                      <h2 className="h5 fw-bold mb-1">
                        Ansprechpartner
                      </h2>
                      <p className="small text-body-secondary mb-0">
                        Kontakte von {selectedCustomer.name}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={saving}
                      onClick={() => openModal("contact")}
                    >
                      ＋ Ansprechpartner
                    </Button>
                  </div>

                  {(selectedCustomer.contacts ?? []).length === 0 ? (
                    <div className="text-center py-5">
                      <h3 className="h6 fw-bold">
                        Noch keine Ansprechpartner
                      </h3>
                      <p className="small text-body-secondary mb-3">
                        Lege den ersten Kontakt für diesen Kunden an.
                      </p>
                      <Button
                        variant="outline-primary"
                        disabled={saving}
                        onClick={() => openModal("contact")}
                      >
                        Ansprechpartner hinzufügen
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Ansprechpartner</th>
                            <th>Position</th>
                            <th>Kontaktdaten</th>
                            <th className="text-end">Aktionen</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCustomer.contacts.map((contact) => (
                            <tr key={contact.id}>
                              <td>
                                <span className="fw-semibold">
                                  {contact.firstName} {contact.lastName}
                                </span>
                              </td>
                              <td>
                                {contact.role || (
                                  <span className="text-body-secondary">
                                    –
                                  </span>
                                )}
                              </td>
                              <td>
                                <div className="small">
                                  {contact.email ? (
                                    <a href={`mailto:${contact.email}`}>
                                      {contact.email}
                                    </a>
                                  ) : (
                                    <span className="text-body-secondary">
                                      Keine E-Mail
                                    </span>
                                  )}
                                </div>
                                <div className="small text-body-secondary mt-1">
                                  {contact.telefon || "Kein Telefon"}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    disabled={saving}
                                    aria-label={`${contact.firstName} ${contact.lastName} bearbeiten`}
                                    onClick={() =>
                                      openModal("contact", contact)
                                    }
                                  >
                                    Bearbeiten
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    disabled={saving}
                                    aria-label={`${contact.firstName} ${contact.lastName} löschen`}
                                    onClick={() => deleteContact(contact)}
                                  >
                                    Löschen
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>

      <CustomerModal
        show={modal.show}
        onHide={closeModal}
        onSave={saveCustomerOrContact}
        type={modal.type}
        initialData={modal.initialData}
      />
    </Container>
  );
}

export default Verwaltung;