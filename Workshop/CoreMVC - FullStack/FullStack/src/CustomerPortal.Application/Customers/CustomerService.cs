using CustomerPortal.Domain;

namespace CustomerPortal.Application.Customers;

/// <summary>Implements customer management business rules.</summary>
public sealed class CustomerService(ICustomerRepository repository) : ICustomerService
{
    /// <inheritdoc />
    public async Task<CustomerResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var customer = await repository.GetByIdAsync(id, cancellationToken);
        return customer is null ? null : ToResponse(customer);
    }

    /// <inheritdoc />
    public Task<IReadOnlyList<CustomerResponse>> SearchAsync(string? search, CancellationToken cancellationToken) =>
        repository.SearchAsync(search?.Trim(), cancellationToken);

    /// <inheritdoc />
    public async Task<CustomerResponse> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken)
    {
        var email = NormalizeEmail(request.Email);
        if (await repository.EmailExistsAsync(email, null, cancellationToken))
            throw new CustomerEmailConflictException();

        var customer = new Customer { Id = Guid.NewGuid(), Name = request.Name.Trim(), Email = email };
        await repository.AddAsync(customer, cancellationToken);
        return ToResponse(customer);
    }

    /// <inheritdoc />
    public async Task<CustomerResponse?> UpdateAsync(Guid id, UpdateCustomerRequest request, CancellationToken cancellationToken)
    {
        var customer = await repository.GetByIdAsync(id, cancellationToken);
        if (customer is null) return null;

        var email = NormalizeEmail(request.Email);
        if (await repository.EmailExistsAsync(email, id, cancellationToken))
            throw new CustomerEmailConflictException();

        customer.Name = request.Name.Trim();
        customer.Email = email;
        await repository.UpdateAsync(customer, cancellationToken);
        return ToResponse(customer);
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var customer = await repository.GetByIdAsync(id, cancellationToken);
        if (customer is null) return false;
        await repository.DeleteAsync(customer, cancellationToken);
        return true;
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
    private static CustomerResponse ToResponse(Customer customer) => new(customer.Id, customer.Name, customer.Email);
}
