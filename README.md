# octojaTask – Kundenverwaltung
Eine Webanwendung zur Kunden- und Ansprechpartnerverwaltung, bestehend aus einem React-Frontend mit react Bootstrap, einer REST-API mit ASP.NET Core und C# auf Basis von .NET 10 sowie einer PostgreSQL-Datenbank. Der Datenbankzugriff erfolgt über Entity Framework Core mit dem PostgreSQL-Provider Npgsql. Die Anwendung ermöglicht das Anlegen, Anzeigen, Bearbeiten und Löschen von Kunden sowie die Verwaltung zugehöriger Ansprechpartner. Zwischen Kunden und Ansprechpartnern besteht eine 1:N-Beziehung.
![Octoja Screenshot](https://i.postimg.cc/Kvvrdhf4/octojaimg.png)

## Verwendete Technologien

- Frontend: React, Vite und Bootstrap
- Backend: ASP.NET Core Web API mit .NET 10
- Datenbank: PostgreSQL
- Datenbankzugriff: Entity Framework Core
- API-Kommunikation: REST

## Voraussetzungen

Vor dem Start müssen folgende Programme installiert sein:

- Node.js v24.22.1 (LTS-Version) bzw. v24 und höher: https://nodejs.org/en/download
- .NET 10 SDK: https://dotnet.microsoft.com/en-us/download/dotnet/10.0
- PostgreSQL v18.6: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
- Optional: pgAdmin4 zur grafischen Verwaltung und Einsicht der Datenbank (wird normal mit installiert)

Die Installationen können über folgende Befehle überprüft werden:

```cmd
node --version      (v.24.22.1 bei mir)
npm --version       (v.11.19.1 bei mir)
dotnet --version    (v.10.0.403 bei mir)
```

## 1. PostgreSQL einrichten

### PostgreSQL installieren

PostgreSQL kann von der offiziellen Webseite heruntergeladen werden:

https://www.postgresql.org/download/

Während der Installation wird ein Passwort für den Datenbankbenutzer `postgres` festgelegt. Dieses Passwort wird später für die Verbindung mit der Datenbank benötigt.

Die Standardkonfiguration verwendet normalerweise den Port `5432`.

### Datenbank erstellen

Die Datenbank kann über pgAdmin oder direkt über SQL erstellt werden.

In pgAdmin:

1. pgAdmin öffnen und mit dem PostgreSQL-Server verbinden.
2. Den Bereich `Databases` öffnen.
3. Mit der rechten Maustaste auf `Databases` klicken.
4. `Create` und anschließend `Database` auswählen.
5. Als Datenbanknamen `octoja_db` eintragen.
6. Owner: postgres
7. Die Datenbank erstellen.

## 2. Backend einrichten

Ein Terminal öffnen und in das Backend-Projekt wechseln:

```cmd
cd Backend\Octoja.Api
```

Die benötigten Abhängigkeiten wiederherstellen:

```cmd
dotnet restore
```

### Datenbankverbindung konfigurieren

Die Verbindungsdaten werden über .NET User Secrets gespeichert. Dadurch muss das Datenbankpasswort nicht direkt in den Quellcode geschrieben oder in die Versionsverwaltung übernommen werden.

User Secrets einmalig für das Projekt aktivieren:

```cmd
dotnet user-secrets init
```

Anschließend die Verbindungszeichenfolge hinterlegen:

```cmd
dotnet user-secrets set "ConnectionStrings:OctojaDb" "Host=localhost;Port=5432;Database=octoja_db;Username=postgres;Password=DEIN_PASSWORT"
```

`DEIN_PASSWORT` durch das bei der PostgreSQL-Installation festgelegte Passwort ersetzen.

Falls PostgreSQL mit einem anderen Port oder Benutzernamen eingerichtet wurde, müssen die entsprechenden Angaben angepasst werden.

### Datenbank erstellen

Die Datenbanktabellen werden beim ersten Start des Backends automatisch erstellt, sofern die Datenbank noch keine Tabellen enthält. Dafür wird EnsureCreatedAsync() in Program.cs verwendet. Für den aktuellen Testbetrieb sind keine Migrationen erforderlich.

Im Backend-Verzeichnis Backend\Octoja.Api folgende Befehle ausführen:

```cmd
dotnet restore
dotnet build
dotnet run
```

Info:
dotnet restore stellt die benötigten Abhängigkeiten wieder her.
dotnet build überprüft, ob das Projekt erfolgreich kompiliert werden kann.
dotnet run startet das Backend und erstellt bei einer leeren Datenbank automatisch die Tabellen.

Wichtig für später:
Wenn später neue Modelle oder Eigenschaften hinzukommen, kann die Datenbank mithilfe von Entity-Framework-Migrationen aktualisiert werden. Dafür sind folgende Befehle vorgesehen:
```cmd
dotnet ef migrations add ModellUpdate
dotnet ef database update
```
ModellUpdate kann durch einen passenden Namen für die jeweilige Änderung ersetzt werden. Der erste Befehl erstellt eine Migration, der zweite wendet sie auf die Datenbank an.

Achtung: 
> [!WARNING]
> Für diesen Testbetrieb ist das nicht notwendig. Die Umstellung von EnsureCreatedAsync() auf Migrationen muss vorher vorbereitet werden, da beide Verfahren nicht ohne Weiteres gemeinsam dieselbe Datenbank verwalten. dotnet-ef muss für die Migrationen außerdem installiert sein.

### Backend starten

Das Backend wird immer mit nachfolgendem Befehl gestartet:

```cmd
dotnet run
```

Die tatsächliche lokale Adresse wird beim Start im Terminal angezeigt. In der aktuellen Konfiguration wird das Backend unter folgender Adresse erwartet:

- API: http://localhost:5190
- Kunden abrufen: http://localhost:5190/api/kunden
- OpenAPI-Dokument: http://localhost:5190/openapi/v1.json

Die Kunden-Endpunkte können beispielsweise über einen Browser oder ein API-Testwerkzeug aufgerufen werden.

Um die Datenbankelemente anzusehen öffne: pdAdmin4
1. Databases/octoja_db/Schemas/public/Tables
2. Rechtsklick auf Tabelle Ansprechpartner oder Kunden
3. View/Edit Data
4. All Rows
5. Oben kann der Playbutton aufgeführt werden um die Abfrage neu zu starten, um zu aktualisieren

## 3. Beispieldaten

Beim ersten Start fügt das Backend automatisch Beispieldaten ein, sofern noch keine Kunden in der Datenbank vorhanden sind.

Die Beispieldaten werden im Backend in `Program.cs` angelegt. Dort können die initialen Kunden und Ansprechpartner angepasst werden.

Die Beispieldaten werden nur eingefügt, wenn die Kundentabelle leer ist. Sind bereits Kunden vorhanden, werden keine weiteren Beispieldaten automatisch hinzugefügt.

Alle Änderungen, die anschließend über die Anwendung vorgenommen werden, werden in PostgreSQL gespeichert.

## 4. Frontend einrichten

Ein zweites Terminal öffnen und in das Frontend-Verzeichnis wechseln.

```cmd
cd Frontend
```

Die benötigten JavaScript-Abhängigkeiten installieren:

```cmd
npm install
```

Das Frontend starten:

```cmd
npm run dev
```

Vite zeigt anschließend die lokale Adresse an. In der Standardkonfiguration ist dies:

http://localhost:5173

Die Adresse im Browser öffnen, um die Anwendung zu verwenden.

## 5. Verbindung zwischen Frontend und Backend

Die Kommunikation mit der API ist in folgender Datei definiert:

`src/services/api.js`

Dort ist die Basisadresse des Backends hinterlegt:

```javascript
const API_URL = "http://localhost:5190/api";
```

Falls das Backend auf einer anderen Adresse oder einem anderen Port läuft, muss diese Adresse entsprechend angepasst werden.

Das Backend erlaubt Anfragen vom lokalen Vite-Frontend unter `http://localhost:5173` und `http://127.0.0.1:5173`.

## 6. Daten verwalten

Die Daten werden über das Frontend eingegeben und vom Backend in PostgreSQL gespeichert.

- Kunden können erstellt, angezeigt, bearbeitet und gelöscht werden.
- Ansprechpartner können einem Kunden zugeordnet und verwaltet werden.
- Änderungen bleiben nach einem Neustart der Anwendung in der Datenbank erhalten.
- Beim Löschen eines Kunden werden die zugehörigen Ansprechpartner ebenfalls gelöscht (Cascade).

Die API-Endpunkte sind im Backend in `Program.cs` definiert.

### Kunden

- `GET /api/kunden` – Alle Kunden abrufen
- `GET /api/kunden/{id}` – Einen Kunden abrufen
- `POST /api/kunden` – Einen Kunden erstellen
- `PUT /api/kunden/{id}` – Einen Kunden bearbeiten
- `DELETE /api/kunden/{id}` – Einen Kunden löschen

### Ansprechpartner

- `GET /api/kunden/{kundeId}/ansprechpartner` – Ansprechpartner eines Kunden abrufen
- `POST /api/kunden/{kundeId}/ansprechpartner` – Ansprechpartner erstellen
- `GET /api/ansprechpartner/{id}` – Einen Ansprechpartner abrufen
- `PUT /api/ansprechpartner/{id}` – Einen Ansprechpartner bearbeiten
- `DELETE /api/ansprechpartner/{id}` – Einen Ansprechpartner löschen

## 7. Projektstruktur

Die wichtigsten Bestandteile des Projekts sind:

```text
octojaTask/
├── Backend/
│   └── Octoja.Api/
│       ├── Data/
│       │   └── OctojaDbContext.cs
│       ├── Dtos/
│       │   └── ApiDtos.cs
│       ├── Models/
│       │   ├── Kunde.cs
│       │   └── Ansprechpartner.cs
│       ├── Program.cs
│       └── appsettings.json
│
└── Frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   └── CustomerModal.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── NotFound.jsx
        │   └── Verwaltung.jsx
        ├── services/
            └── api.js
```


## 8. Anwendung starten

Für den normalen Betrieb werden zwei Terminals benötigt.

Terminal 1 – Backend:

```cmd
cd Backend\Octoja.Api
dotnet run
```

Terminal 2 – Frontend:

```cmd
cd Frontend
npm run dev
```

Anschließend die vom Frontend ausgegebene lokale Adresse im Browser öffnen.

## 9. Häufige Probleme

### Verbindung zur Datenbank schlägt fehl

- Prüfen, ob PostgreSQL gestartet ist.
- Prüfen, ob Datenbankname, Port und Benutzername stimmen.
- Prüfen, ob das Passwort in den User Secrets korrekt gespeichert wurde.
- Sicherstellen, dass die Datenbank `octoja_db` existiert.

### Datenbanktabellen fehlen

Im Backend-Verzeichnis folgenden Befehl ausführen:

```cmd
dotnet restore
dotnet build
dotnet run
```

### Frontend

- Sicherstellen, dass node_modules Ordner nach "npm install" erscheint.
- Schauen dass das Frontend läuft nach: "npm run dev"
- Die Basisadresse in `src/services/api.js` überprüfen.
