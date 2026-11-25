namespace CustomerPortal.Application.Customers;

/// <summary>Customer details returned to clients.</summary>
public sealed record CustomerResponse(Guid Id, string Name, string Email);

/// <summary>Data for creating a customer.</summary>
public sealed record CreateCustomerRequest(string Name, string Email) : ICustomerInput;

/// <summary>Data for replacing a customer's details.</summary>
public sealed record UpdateCustomerRequest(string Name, string Email) : ICustomerInput;

/// <summary>Fields shared by customer creation and updates.</summary>
public interface ICustomerInput
{
    /// <summary>The customer's name.</summary>
    string Name { get; }
    /// <summary>The customer's email address.</summary>
    string Email { get; }
}
