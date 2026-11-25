using CustomerPortal.Application.Customers;

namespace CustomerPortal.UnitTests.Customers;

public sealed class CustomerValidatorTests
{
    [Theory]
    [InlineData("", "jane@example.com")]
    [InlineData("  ", "jane@example.com")]
    [InlineData("Jane", "invalid")]
    [InlineData("Jane", "")]
    public void Validate_InvalidCreateRequest_IsInvalid(string name, string email)
    {
        var validator = new CreateCustomerValidator();

        var result = validator.Validate(new CreateCustomerRequest(name, email));

        Assert.False(result.IsValid);
    }

    [Fact]
    public void Validate_OversizedUpdateName_IsInvalid()
    {
        var validator = new UpdateCustomerValidator();

        var result = validator.Validate(new UpdateCustomerRequest(new string('a', 201), "jane@example.com"));

        Assert.False(result.IsValid);
    }

    [Fact]
    public void Validate_ValidUpdate_IsValid()
    {
        var validator = new UpdateCustomerValidator();

        var result = validator.Validate(new UpdateCustomerRequest("Jane", "jane@example.com"));

        Assert.True(result.IsValid);
    }
}
