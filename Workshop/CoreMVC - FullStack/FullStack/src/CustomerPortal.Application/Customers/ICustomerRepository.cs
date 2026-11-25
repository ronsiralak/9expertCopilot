using CustomerPortal.Domain;

namespace CustomerPortal.Application.Customers;

/// <summary>Persistence operations needed by customer management.</summary>
public interface ICustomerRepository
{
    /// <summary>Finds one customer by identifier.</summary>
    Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    /// <summary>Checks whether another customer has the specified normalized email.</summary>
    Task<bool> EmailExistsAsync(string email, Guid? exceptId, CancellationToken cancellationToken);
    /// <summary>Finds at most 100 customers matching a search term.</summary>
    Task<IReadOnlyList<CustomerResponse>> SearchAsync(string? search, CancellationToken cancellationToken);
    /// <summary>Adds and saves a customer.</summary>
    Task AddAsync(Customer customer, CancellationToken cancellationToken);
    /// <summary>Saves changes to a customer.</summary>
    Task UpdateAsync(Customer customer, CancellationToken cancellationToken);
    /// <summary>Deletes a customer.</summary>
    Task DeleteAsync(Customer customer, CancellationToken cancellationToken);
}
