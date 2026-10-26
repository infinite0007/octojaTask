
using Octoja.Api.Models;

namespace Octoja.Api.Dtos;

/*
DTO steht für Data Transfer Object. Das sind Objekte, die festlegen, welche Daten zwischen Frontend und Backend übertragen werden.
KundeRequest -> Daten, die React beim Erstellen oder Bearbeiten eines Kunden sendet
AnsprechpartnerRequest -> Daten, die React für einen Ansprechpartner sendet
KundeResponse -> Kundendaten, die das Backend an React zurückgibt
AnsprechpartnerResponse	-> Daten eines Ansprechpartners, die das Backend zurückgibt
*/

public record KundeRequest(
    string Name,
    string? Email,
    string? Telefon,
    string? Strasse,
    string? Plz,
    string? Ort
);

public record AnsprechpartnerRequest(
    string FirstName,
    string LastName,
    string? Role,
    string? Email,
    string? Telefon
);

public record AnsprechpartnerResponse(
    int Id,
    string FirstName,
    string LastName,
    string? Role,
    string? Email,
    string? Telefon,
    int KundeId
);

public record KundeResponse(
    int Id,
    string Name,
    string? Email,
    string? Telefon,
    string? Strasse,
    string? Plz,
    string? Ort,
    List<AnsprechpartnerResponse> Contacts
);

public static class ApiMapping
{
    public static AnsprechpartnerResponse ToResponse(
        this Ansprechpartner a)
    {
        return new AnsprechpartnerResponse(
            a.Id,
            a.FirstName,
            a.LastName,
            a.Role,
            a.Email,
            a.Telefon,
            a.KundeId
        );
    }

    public static KundeResponse ToResponse(this Kunde k)
    {
        return new KundeResponse(
            k.Id,
            k.Name,
            k.Email,
            k.Telefon,
            k.Strasse,
            k.Plz,
            k.Ort,
            k.Contacts.Select(a => a.ToResponse()).ToList()
        );
    }
}