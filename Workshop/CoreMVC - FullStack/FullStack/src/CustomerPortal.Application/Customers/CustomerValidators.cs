using FluentValidation;

namespace CustomerPortal.Application.Customers;

/// <summary>Validates data used to create a customer.</summary>
public sealed class CreateCustomerValidator : CustomerValidator<CreateCustomerRequest>
{
    /// <summary>Configures customer creation validation rules.</summary>
    public CreateCustomerValidator() { }
}

/// <summary>Validates data used to update a customer.</summary>
public sealed class UpdateCustomerValidator : CustomerValidator<UpdateCustomerRequest>
{
    /// <summary>Configures customer update validation rules.</summary>
    public UpdateCustomerValidator() { }
}

/// <summary>Shared validation rules for customer details.</summary>
public abstract class CustomerValidator<T> : AbstractValidator<T> where T : ICustomerInput
{
    /// <summary>Configures validation rules for customer details.</summary>
    protected CustomerValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().MaximumLength(256).EmailAddress();
    }
}
