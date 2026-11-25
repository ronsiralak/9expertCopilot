namespace CustomerPortal.Application.Customers;

/// <summary>Indicates that a customer's email address is already in use.</summary>
public sealed class CustomerEmailConflictException : Exception
{
    /// <summary>Creates an email conflict exception.</summary>
    public CustomerEmailConflictException() : base("A customer with this email already exists.") { }
}
