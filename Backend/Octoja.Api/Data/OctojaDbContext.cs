// Ein Kunde kann null, einen oder viele Ansprechpartner haben.
// Jeder Ansprechpartner muss eine gültige KundeId besitzen.
// Ein Ansprechpartner kann nicht mehreren Kunden gleichzeitig zugeordnet sein.
// Löschen wir einen Kunden, sollen seine Ansprechpartner ebenfalls gelöscht werden.

using Microsoft.EntityFrameworkCore;
using Octoja.Api.Models;

namespace Octoja.Api.Data;

public class OctojaDbContext : DbContext
{
    public OctojaDbContext(DbContextOptions<OctojaDbContext> options)
        : base(options)
    {
    }

    public DbSet<Kunde> Kunden => Set<Kunde>();

    public DbSet<Ansprechpartner> Ansprechpartner => Set<Ansprechpartner>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Kunde>()
            .HasMany(k => k.Contacts)
            .WithOne(a => a.Kunde)
            .HasForeignKey(a => a.KundeId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Kunde>()
            .Property(k => k.Name)
            .IsRequired()
            .HasMaxLength(200);

        modelBuilder.Entity<Ansprechpartner>()
            .Property(a => a.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        modelBuilder.Entity<Ansprechpartner>()
            .Property(a => a.LastName)
            .IsRequired()
            .HasMaxLength(100);
    }
}