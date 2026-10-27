
const API_URL = "http://localhost:5190/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP-Fehler ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getCustomers: () => request("/kunden"),

  getCustomer: (id) =>
    request(`/kunden/${id}`),

  createCustomer: (customer) =>
    request("/kunden", {
      method: "POST",
      body: JSON.stringify(customer),
    }),

  updateCustomer: (id, customer) =>
    request(`/kunden/${id}`, {
      method: "PUT",
      body: JSON.stringify(customer),
    }),

  deleteCustomer: (id) =>
    request(`/kunden/${id}`, {
      method: "DELETE",
    }),

  getContacts: (customerId) =>
    request(`/kunden/${customerId}/ansprechpartner`),

  createContact: (customerId, contact) =>
    request(`/kunden/${customerId}/ansprechpartner`, {
      method: "POST",
      body: JSON.stringify(contact),
    }),

  updateContact: (id, contact) =>
    request(`/ansprechpartner/${id}`, {
      method: "PUT",
      body: JSON.stringify(contact),
    }),

  deleteContact: (id) =>
    request(`/ansprechpartner/${id}`, {
      method: "DELETE",
    }),
};