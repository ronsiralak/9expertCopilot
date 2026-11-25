using CustomerPortal.Application.Customers;
using CustomerPortal.Domain;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Infrastructure;

/// <summary>Entity Framework persistence for customers.</summary>
public sealed class CustomerRepository(CustomerDbContext db) : ICustomerRepository
{
    /// <inheritdoc />
    public Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        db.Customers.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    /// <inheritdoc />
    public Task<bool> EmailExistsAsync(string email, Guid? exceptId, CancellationToken cancellationToken) =>
        db.Customers.AsNoTracking().AnyAsync(x => x.Email == email && x.Id != exceptId, cancellationToken);

    /// <inheritdoc />
    public async Task<IReadOnlyList<CustomerResponse>> SearchAsync(string? search, CancellationToken cancellationToken)
    {
        var query = db.Customers.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x => x.Name.Contains(search) || x.Email.Contains(search));

        return await query.OrderBy(x => x.Name).ThenBy(x => x.Id).Take(100)
            .Select(x => new CustomerResponse(x.Id, x.Name, x.Email)).ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task AddAsync(Customer customer, CancellationToken cancellationToken)
    {
        db.Customers.Add(customer);
        await SaveAsync(cancellationToken);
    }

    /// <inheritdoc />
    public Task UpdateAsync(Customer customer, CancellationToken cancellationToken)
    {
        db.Customers.Update(customer);
        return SaveAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task DeleteAsync(Customer customer, CancellationToken cancellationToken)
    {
        db.Customers.Remove(customer);
        await db.SaveChangesAsync(cancellationToken);
    }

    private async Task SaveAsync(CancellationToken cancellationToken)
    {
        try
        {
            await db.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 2601 or 2627 })
        {
            throw new CustomerEmailConflictException();
        }
    }
}
