
using Microsoft.EntityFrameworkCore;
using Octoja.Api.Data;

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


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");

app.MapGet("/", () => Results.Ok(new
{
    message = "Octoja API läuft"
}));


app.Run();