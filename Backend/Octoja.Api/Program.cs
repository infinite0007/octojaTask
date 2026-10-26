
using Microsoft.EntityFrameworkCore;
using Octoja.Api.Data;
using Octoja.Api.Dtos;
using Octoja.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// OpenAPI-Dokumentation
// ganze Dokumentation: https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// PostgreSQL
builder.Services.AddDbContext<OctojaDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("OctojaDb")
    )
);

// React-Frontend darf auf die API zugreifen.
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});

var app = builder.Build();

// Datenbanktabellen beim ersten Start erstellen
// Beispieldaten nur einfügen, wenn noch keine Kunden existieren
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<OctojaDbContext>();

    await db.Database.EnsureCreatedAsync();

    if (!await db.Kunden.AnyAsync())
    {
        db.Kunden.AddRange(
            new Kunde
            {
                Name = "Musterbau GmbH",
                Email = "info@musterbau.de",
                Telefon = "+49 89 123456",
                Strasse = "Musterstraße 12",
                Plz = "80331",
                Ort = "München",
                Contacts =
                [
                    new Ansprechpartner
                    {
                        FirstName = "Anna",
                        LastName = "Schneider",
                        Role = "Geschäftsführung",
                        Email = "anna.schneider@musterbau.de",
                        Telefon = "+49 89 123457"
                    },
                    new Ansprechpartner
                    {
                        FirstName = "Markus",
                        LastName = "Weber",
                        Role = "Einkauf",
                        Email = "markus.weber@musterbau.de",
                        Telefon = "+49 89 123458"
                    }
                ]
            },
            new Kunde
            {
                Name = "Tech Solutions GmbH",
                Email = "kontakt@tech-solutions.de",
                Telefon = "+49 711 987654",
                Strasse = "Innovationsallee 8",
                Plz = "70173",
                Ort = "Stuttgart",
                Contacts =
                [
                    new Ansprechpartner
                    {
                        FirstName = "Laura",
                        LastName = "Fischer",
                        Role = "Projektleitung",
                        Email = "laura.fischer@tech-solutions.de",
                        Telefon = "+49 711 987655"
                    }
                ]
            },
            new Kunde
            {
                Name = "Alpenblick Handel KG",
                Email = "info@alpenblick-handel.de",
                Telefon = "+49 831 456789",
                Strasse = "Bahnhofplatz 4",
                Plz = "87435",
                Ort = "Kempten"
            }
        );

        await db.SaveChangesAsync();
    }
}


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");

app.MapGet("/", () => Results.Ok(new
{
    message = "Octoja API läuft"
}));

// -------------------------
// KUNDEN
// -------------------------

// Alle Kunden inklusive Ansprechpartner
app.MapGet("/api/kunden", async (OctojaDbContext db) =>
{
    var kunden = await db.Kunden
        .Include(k => k.Contacts)
        .AsNoTracking()
        .OrderBy(k => k.Name)
        .ToListAsync();

    return Results.Ok(kunden.Select(k => k.ToResponse()));
});

// Einzelnen Kunden inklusive Ansprechpartner abrufen
app.MapGet("/api/kunden/{id:int}", async (
    int id,
    OctojaDbContext db) =>
{
    var kunde = await db.Kunden
        .Include(k => k.Contacts)
        .AsNoTracking()
        .FirstOrDefaultAsync(k => k.Id == id);

    if (kunde is null)
        return Results.NotFound();

    return Results.Ok(kunde.ToResponse());
});

// Kunden erstellen
app.MapPost("/api/kunden", async (
    KundeRequest request,
    OctojaDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
        return Results.BadRequest(new { message = "Der Kundenname ist erforderlich." });

    var kunde = new Kunde
    {
        Name = request.Name.Trim(),
        Email = request.Email,
        Telefon = request.Telefon,
        Strasse = request.Strasse,
        Plz = request.Plz,
        Ort = request.Ort
    };

    db.Kunden.Add(kunde);
    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/kunden/{kunde.Id}",
        kunde.ToResponse()
    );
});

// Kunden bearbeiten
app.MapPut("/api/kunden/{id:int}", async (
    int id,
    KundeRequest request,
    OctojaDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
        return Results.BadRequest(new { message = "Der Kundenname ist erforderlich." });

    var kunde = await db.Kunden
        .Include(k => k.Contacts)
        .FirstOrDefaultAsync(k => k.Id == id);

    if (kunde is null)
        return Results.NotFound();

    kunde.Name = request.Name.Trim();
    kunde.Email = request.Email;
    kunde.Telefon = request.Telefon;
    kunde.Strasse = request.Strasse;
    kunde.Plz = request.Plz;
    kunde.Ort = request.Ort;

    await db.SaveChangesAsync();

    return Results.Ok(kunde.ToResponse());
});

// Kunden löschen (Ansprechpartner werden per Cascade mitgelöscht)
app.MapDelete("/api/kunden/{id:int}", async (
    int id,
    OctojaDbContext db) =>
{
    var kunde = await db.Kunden.FindAsync(id);

    if (kunde is null)
        return Results.NotFound();

    db.Kunden.Remove(kunde);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

// -------------------------
// ANSPRECHPARTNER
// -------------------------

// Ansprechpartner eines Kunden abrufen
app.MapGet("/api/kunden/{kundeId:int}/ansprechpartner", async (
    int kundeId,
    OctojaDbContext db) =>
{
    var kundeExists = await db.Kunden
        .AnyAsync(k => k.Id == kundeId);

    if (!kundeExists)
        return Results.NotFound();

    var contacts = await db.Ansprechpartner
        .Where(a => a.KundeId == kundeId)
        .AsNoTracking()
        .OrderBy(a => a.LastName)
        .ThenBy(a => a.FirstName)
        .ToListAsync();

    return Results.Ok(contacts.Select(a => a.ToResponse()));
});

// Ansprechpartner erstellen – immer unter einem Kunden
app.MapPost("/api/kunden/{kundeId:int}/ansprechpartner", async (
    int kundeId,
    AnsprechpartnerRequest request,
    OctojaDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.FirstName) ||
        string.IsNullOrWhiteSpace(request.LastName))
    {
        return Results.BadRequest(new
        {
            message = "Vorname und Nachname sind erforderlich."
        });
    }

    var kundeExists = await db.Kunden
        .AnyAsync(k => k.Id == kundeId);

    if (!kundeExists)
        return Results.NotFound(new { message = "Kunde nicht gefunden." });

    var contact = new Ansprechpartner
    {
        FirstName = request.FirstName.Trim(),
        LastName = request.LastName.Trim(),
        Role = request.Role,
        Email = request.Email,
        Telefon = request.Telefon,
        KundeId = kundeId
    };

    db.Ansprechpartner.Add(contact);
    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/ansprechpartner/{contact.Id}",
        contact.ToResponse()
    );
});

// Einzelnen Ansprechpartner abrufen
app.MapGet("/api/ansprechpartner/{id:int}", async (
    int id,
    OctojaDbContext db) =>
{
    var contact = await db.Ansprechpartner
        .AsNoTracking()
        .FirstOrDefaultAsync(a => a.Id == id);

    if (contact is null)
        return Results.NotFound();

    return Results.Ok(contact.ToResponse());
});

// Ansprechpartner bearbeiten – die Kunden-Zuordnung bleibt erhalten
app.MapPut("/api/ansprechpartner/{id:int}", async (
    int id,
    AnsprechpartnerRequest request,
    OctojaDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.FirstName) ||
        string.IsNullOrWhiteSpace(request.LastName))
    {
        return Results.BadRequest(new
        {
            message = "Vorname und Nachname sind erforderlich."
        });
    }

    var contact = await db.Ansprechpartner.FindAsync(id);

    if (contact is null)
        return Results.NotFound();

    contact.FirstName = request.FirstName.Trim();
    contact.LastName = request.LastName.Trim();
    contact.Role = request.Role;
    contact.Email = request.Email;
    contact.Telefon = request.Telefon;

    await db.SaveChangesAsync();

    return Results.Ok(contact.ToResponse());
});

// Ansprechpartner löschen
app.MapDelete("/api/ansprechpartner/{id:int}", async (
    int id,
    OctojaDbContext db) =>
{
    var contact = await db.Ansprechpartner.FindAsync(id);

    if (contact is null)
        return Results.NotFound();

    db.Ansprechpartner.Remove(contact);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();