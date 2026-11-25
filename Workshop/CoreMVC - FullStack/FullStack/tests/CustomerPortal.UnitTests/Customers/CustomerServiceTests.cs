using CustomerPortal.Application.Customers;
using CustomerPortal.Domain;
using Moq;

namespace CustomerPortal.UnitTests.Customers;

public sealed class CustomerServiceTests
{
    private readonly Mock<ICustomerRepository> _repository = new();

    [Fact]
    public async Task GetByIdAsync_ExistingCustomer_ReturnsCustomerDetails()
    {
        var customer = new Customer { Id = Guid.NewGuid(), Name = "Jane", Email = "jane@example.com" };
        _repository.Setup(x => x.GetByIdAsync(customer.Id, It.IsAny<CancellationToken>())).ReturnsAsync(customer);
        var service = new CustomerService(_repository.Object);

        var result = await service.GetByIdAsync(customer.Id, CancellationToken.None);

        Assert.Equal(new CustomerResponse(customer.Id, customer.Name, customer.Email), result);
    }

    [Fact]
    public async Task GetByIdAsync_MissingCustomer_ReturnsNull()
    {
        var service = new CustomerService(_repository.Object);

        var result = await service.GetByIdAsync(Guid.NewGuid(), CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_NewCustomer_NormalizesAndSaves()
    {
        var service = new CustomerService(_repository.Object);
        var request = new CreateCustomerRequest("  Jane  ", "Jane@Example.com");
        Customer? saved = null;
        _repository.Setup(x => x.AddAsync(It.IsAny<Customer>(), It.IsAny<CancellationToken>()))
            .Callback<Customer, CancellationToken>((customer, _) => saved = customer)
            .Returns(Task.CompletedTask);

        var result = await service.CreateAsync(request, CancellationToken.None);

        Assert.NotNull(saved);
        Assert.Equal((saved.Id, "Jane", "jane@example.com"), (result.Id, result.Name, result.Email));
    }

    [Fact]
    public async Task CreateAsync_DuplicateEmail_ThrowsConflict()
    {
        _repository.Setup(x => x.EmailExistsAsync("jane@example.com", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        var service = new CustomerService(_repository.Object);

        await Assert.ThrowsAsync<CustomerEmailConflictException>(() =>
            service.CreateAsync(new CreateCustomerRequest("Jane", "Jane@example.com"), CancellationToken.None));

        _repository.Verify(x => x.AddAsync(It.IsAny<Customer>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_ExistingCustomer_ExcludesOwnIdFromDuplicateCheck()
    {
        var customer = new Customer { Id = Guid.NewGuid(), Name = "Old", Email = "old@example.com" };
        _repository.Setup(x => x.GetByIdAsync(customer.Id, It.IsAny<CancellationToken>())).ReturnsAsync(customer);
        var service = new CustomerService(_repository.Object);

        var result = await service.UpdateAsync(customer.Id, new UpdateCustomerRequest("New", "New@example.com"), CancellationToken.None);

        Assert.Equal(new CustomerResponse(customer.Id, "New", "new@example.com"), result);
        _repository.Verify(x => x.EmailExistsAsync("new@example.com", customer.Id, It.IsAny<CancellationToken>()), Times.Once);
        _repository.Verify(x => x.UpdateAsync(customer, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_DuplicateEmail_ThrowsConflictWithoutSaving()
    {
        var customer = new Customer { Id = Guid.NewGuid(), Name = "Old", Email = "old@example.com" };
        _repository.Setup(x => x.GetByIdAsync(customer.Id, It.IsAny<CancellationToken>())).ReturnsAsync(customer);
        _repository.Setup(x => x.EmailExistsAsync("taken@example.com", customer.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        var service = new CustomerService(_repository.Object);

        await Assert.ThrowsAsync<CustomerEmailConflictException>(() =>
            service.UpdateAsync(customer.Id, new UpdateCustomerRequest("New", "taken@example.com"), CancellationToken.None));

        _repository.Verify(x => x.UpdateAsync(It.IsAny<Customer>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_MissingCustomer_ReturnsNull()
    {
        var service = new CustomerService(_repository.Object);

        var result = await service.UpdateAsync(Guid.NewGuid(), new UpdateCustomerRequest("Jane", "jane@example.com"), CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_MissingCustomer_ReturnsFalse()
    {
        var service = new CustomerService(_repository.Object);

        var result = await service.DeleteAsync(Guid.NewGuid(), CancellationToken.None);

        Assert.False(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingCustomer_DeletesAndReturnsTrue()
    {
        var customer = new Customer { Id = Guid.NewGuid() };
        _repository.Setup(x => x.GetByIdAsync(customer.Id, It.IsAny<CancellationToken>())).ReturnsAsync(customer);
        var service = new CustomerService(_repository.Object);

        var result = await service.DeleteAsync(customer.Id, CancellationToken.None);

        Assert.True(result);
        _repository.Verify(x => x.DeleteAsync(customer, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SearchAsync_WhitespaceAroundTerm_TrimsBeforeSearching()
    {
        var service = new CustomerService(_repository.Object);

        await service.SearchAsync("  Jane  ", CancellationToken.None);

        _repository.Verify(x => x.SearchAsync("Jane", It.IsAny<CancellationToken>()), Times.Once);
    }
}
