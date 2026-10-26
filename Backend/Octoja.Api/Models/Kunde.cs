
namespace Octoja.Api.Models;

public class Kunde
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public string? Email { get; set; }

    public string? Telefon { get; set; }

    public string? Strasse { get; set; }

    public string? Plz { get; set; }

    public string? Ort { get; set; }

    // Ein Kunde kann viele Ansprechpartner haben.
    public List<Ansprechpartner> Contacts { get; set; } = new();
}