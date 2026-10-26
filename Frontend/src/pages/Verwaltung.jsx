
import { useMemo, useState } from "react";
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
import { demoData } from "../data/DemoData";

function createId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function getInitials(firstName = "", lastName = "") {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function Verwaltung() {
  const [customers, setCustomers] = useState(demoData);
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    demoData[0]?.id ?? null,
  );
  const [modal, setModal] = useState({
    show: false,
    type: "customer",
    initialData: null,
  });

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
        ...customer.contacts.flatMap((contact) => [
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
    customers.find((customer) => customer.id === selectedCustomerId) ?? null;

  function openModal(type, initialData = null) {
    setModal({ show: true, type, initialData });
  }

  function closeModal() {
    setModal((current) => ({ ...current, show: false }));
  }

  function saveCustomerOrContact(formData) {
    const { type, initialData } = modal;

    if (type === "customer") {
      if (initialData) {
        setCustomers((current) =>
          current.map((customer) =>
            customer.id === initialData.id
              ? { ...customer, ...formData, contacts: customer.contacts }
              : customer,
          ),
        );
      } else {
        const newCustomer = {
          ...formData,
          id: createId(),
          contacts: [],
        };

        setCustomers((current) => [...current, newCustomer]);
        setSelectedCustomerId(newCustomer.id);
      }
    } else if (selectedCustomerId !== null) {
      if (initialData) {
        setCustomers((current) =>
          current.map((customer) =>
            customer.id === selectedCustomerId
              ? {
                  ...customer,
                  contacts: customer.contacts.map((contact) =>
                    contact.id === initialData.id
                      ? { ...contact, ...formData }
                      : contact,
                  ),
                }
              : customer,
          ),
        );
      } else {
        const newContact = { ...formData, id: createId() };

        setCustomers((current) =>
          current.map((customer) =>
            customer.id === selectedCustomerId
              ? {
                  ...customer,
                  contacts: [...customer.contacts, newContact],
                }
              : customer,
          ),
        );
      }
    }

    closeModal();
  }

  function deleteCustomer(customer) {
    const confirmed = window.confirm(
      `Möchtest du den Kunden „${customer.name}“ wirklich löschen? Seine Ansprechpartner werden ebenfalls gelöscht.`,
    );

    if (!confirmed) return;

    setCustomers((current) =>
      current.filter((item) => item.id !== customer.id),
    );

    if (selectedCustomerId === customer.id) {
      const nextCustomer = customers.find((item) => item.id !== customer.id);
      setSelectedCustomerId(nextCustomer?.id ?? null);
    }
  }

  function deleteContact(contact) {
    const confirmed = window.confirm(
      `Möchtest du ${contact.firstName} ${contact.lastName} wirklich löschen?`,
    );

    if (!confirmed || selectedCustomerId === null) return;

    setCustomers((current) =>
      current.map((customer) =>
        customer.id === selectedCustomerId
          ? {
              ...customer,
              contacts: customer.contacts.filter(
                (item) => item.id !== contact.id,
              ),
            }
          : customer,
      ),
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
        >
          <span aria-hidden="true">＋ </span>Kunde hinzufügen
        </Button>
      </div>

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
                  (total, customer) => total + customer.contacts.length,
                  0,
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
                <Badge bg="secondary" pill>{filteredCustomers.length}</Badge>
              </div>

              <InputGroup className="mb-3">
                <InputGroup.Text aria-hidden="true">⌕</InputGroup.Text>
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
                    <div className="fw-semibold">Keine Kunden gefunden</div>
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
                        {customer.name} {" in "}
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
                <h2 className="h5 fw-bold">Noch kein Kunde ausgewählt</h2>
                <p className="text-body-secondary">
                  Wähle links einen Kunden aus oder lege einen neuen an.
                </p>
                <Button
                  variant="primary"
                  onClick={() => openModal("customer")}
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
                    <div className="d-flex gap-3">
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
                            [selectedCustomer.plz, selectedCustomer.ort]
                              .filter(Boolean)
                              .join(" "),
                          ]
                            .filter(Boolean)
                            .join(", ") || "Keine Adresse hinterlegt"}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() =>
                          openModal("customer", selectedCustomer)
                        }
                      >
                        Bearbeiten
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
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
                      <h2 className="h5 fw-bold mb-1">Ansprechpartner</h2>
                      <p className="small text-body-secondary mb-0">
                        Kontakte von {selectedCustomer.name}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openModal("contact")}
                    >
                      ＋ Ansprechpartner
                    </Button>
                  </div>

                  {selectedCustomer.contacts.length === 0 ? (
                    <div className="text-center py-5">
                      <h3 className="h6 fw-bold">
                        Noch keine Ansprechpartner
                      </h3>
                      <p className="small text-body-secondary mb-3">
                        Lege den ersten Kontakt für diesen Kunden an.
                      </p>
                      <Button
                        variant="outline-primary"
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
                                <div className="d-flex align-items-center gap-2">
                                  <span className="fw-semibold">
                                    {contact.firstName} {contact.lastName}
                                  </span>
                                </div>
                              </td>
                              <td>
                                {contact.role || (
                                  <span className="text-body-secondary">–</span>
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

      <Alert variant="info" className="mt-4 mb-0 small">
        <strong>Hinweis:</strong> Diese Version nutzt noch Beispieldaten im Browser.
        Beim Neuladen werden Änderungen zurückgesetzt. Die dauerhafte Speicherung
        erfolgt später über die C#-API und PostgreSQL.
      </Alert>

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
