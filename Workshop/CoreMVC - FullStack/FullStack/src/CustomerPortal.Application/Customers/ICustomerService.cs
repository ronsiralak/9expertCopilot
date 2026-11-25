namespace CustomerPortal.Application.Customers;

/// <summary>Customer management operations.</summary>
public interface ICustomerService
{
    /// <summary>Gets a customer, or null if not found.</summary>
    Task<CustomerResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    /// <summary>Searches customers by name or email.</summary>
    Task<IReadOnlyList<CustomerResponse>> SearchAsync(string? search, CancellationToken cancellationToken);
    /// <summary>Creates a customer with a unique email address.</summary>
    Task<CustomerResponse> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken);
    /// <summary>Updates an existing customer, or returns null if absent.</summary>
    Task<CustomerResponse?> UpdateAsync(Guid id, UpdateCustomerRequest request, CancellationToken cancellationToken);
    /// <summary>Deletes a customer and reports whether it existed.</summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
