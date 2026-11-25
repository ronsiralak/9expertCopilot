namespace CustomerPortal.Domain;

/// <summary>A customer managed by the portal.</summary>
public sealed class Customer
{
    /// <summary>The customer's identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>The customer's display name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>The customer's normalized email address.</summary>
    public string Email { get; set; } = string.Empty;
}
