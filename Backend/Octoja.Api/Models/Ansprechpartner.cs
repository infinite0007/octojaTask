
namespace Octoja.Api.Models;

public class Ansprechpartner
{
    public int Id { get; set; }

    public string FirstName { get; set; } = "";

    public string LastName { get; set; } = "";

    public string? Role { get; set; }

    public string? Email { get; set; }

    public string? Telefon { get; set; }

    // Fremdschlüssel: Jeder Ansprechpartner gehört zu genau einem Kunden.
    public int KundeId { get; set; }

    public Kunde? Kunde { get; set; }
}