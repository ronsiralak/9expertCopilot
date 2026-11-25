using CustomerPortal.Domain;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Infrastructure;

/// <summary>Database context for the customer portal.</summary>
public sealed class CustomerDbContext(DbContextOptions<CustomerDbContext> options) : DbContext(options)
{
    /// <summary>The customers stored in the database.</summary>
    public DbSet<Customer> Customers => Set<Customer>();

    /// <inheritdoc />
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var customer = modelBuilder.Entity<Customer>();
        customer.HasKey(x => x.Id);
        customer.Property(x => x.Name).HasMaxLength(200).IsRequired();
        customer.Property(x => x.Email).HasMaxLength(256).IsRequired();
        customer.HasIndex(x => x.Email).IsUnique();
    }
}
