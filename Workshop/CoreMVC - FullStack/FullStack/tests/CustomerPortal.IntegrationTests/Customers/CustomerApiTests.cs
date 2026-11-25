using System.Net;
using System.Net.Http.Json;
using CustomerPortal.Application.Customers;
using CustomerPortal.Domain;
using CustomerPortal.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace CustomerPortal.IntegrationTests.Customers;

public sealed class CustomerApiTests
{
    [Fact]
    public async Task CustomerEndpoints_CreateSearchUpdateDelete_WorksEndToEnd()
    {
        using var factory = new CustomerApiFactory();
        using var client = factory.CreateClient();

        var created = await client.PostAsJsonAsync("/api/customers", new CreateCustomerRequest("Jane", "Jane@example.com"));
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Assert.NotNull(created.Headers.Location);
        var customer = await created.Content.ReadFromJsonAsync<CustomerResponse>();
        Assert.NotNull(customer);
        Assert.Equal("jane@example.com", customer.Email);

        var search = await client.GetFromJsonAsync<List<CustomerResponse>>("/api/customers?search=Jane");
        Assert.Single(search!);
        var updated = await client.PutAsJsonAsync($"/api/customers/{customer.Id}", new UpdateCustomerRequest("Janet", "janet@example.com"));
        Assert.Equal(HttpStatusCode.OK, updated.StatusCode);
        var fetched = await client.GetFromJsonAsync<CustomerResponse>($"/api/customers/{customer.Id}");
        Assert.Equal("Janet", fetched?.Name);
        var deleted = await client.DeleteAsync($"/api/customers/{customer.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleted.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"/api/customers/{customer.Id}")).StatusCode);
    }

    [Fact]
    public async Task Create_InvalidOrDuplicateData_ReturnsBadRequestOrConflict()
    {
        using var factory = new CustomerApiFactory();
        using var client = factory.CreateClient();
        await client.PostAsJsonAsync("/api/customers", new CreateCustomerRequest("Jane", "jane@example.com"));

        var invalid = await client.PostAsJsonAsync("/api/customers", new CreateCustomerRequest("", "bad"));
        var duplicate = await client.PostAsJsonAsync("/api/customers", new CreateCustomerRequest("Other", "JANE@example.com"));

        Assert.Equal(HttpStatusCode.BadRequest, invalid.StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, duplicate.StatusCode);
    }

    [Fact]
    public async Task Search_MoreThanOneHundredCustomers_ReturnsAtMostOneHundred()
    {
        using var factory = new CustomerApiFactory();
        using var client = factory.CreateClient();
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CustomerDbContext>();
        db.Customers.AddRange(Enumerable.Range(0, 101).Select(index =>
            new Customer { Id = Guid.NewGuid(), Name = $"Customer {index:D3}", Email = $"customer{index}@example.com" }));
        await db.SaveChangesAsync();

        var customers = await client.GetFromJsonAsync<List<CustomerResponse>>("/api/customers");

        Assert.Equal(100, customers?.Count);
    }

    [Fact]
    public async Task Search_TooLongTerm_ReturnsBadRequest()
    {
        using var factory = new CustomerApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync($"/api/customers?search={new string('a', 201)}");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Swagger_DocumentRequested_DescribesCustomerEndpoints()
    {
        using var factory = new CustomerApiFactory();
        using var client = factory.CreateClient();

        var document = await client.GetStringAsync("/swagger/v1/swagger.json");

        Assert.Contains("/api/customers/{id}", document);
    }

    private sealed class CustomerApiFactory : WebApplicationFactory<Program>
    {
        private readonly SqliteConnection _connection = new("DataSource=:memory:");

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            _connection.Open();
            builder.UseEnvironment("Development");
            builder.UseSetting("ConnectionStrings:CustomerPortal", "Server=unused;Database=unused;Integrated Security=true");
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<DbContextOptions<CustomerDbContext>>();
                services.AddDbContext<CustomerDbContext>(options => options.UseSqlite(_connection));
                using var scope = services.BuildServiceProvider().CreateScope();
                scope.ServiceProvider.GetRequiredService<CustomerDbContext>().Database.EnsureCreated();
            });
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            if (disposing) _connection.Dispose();
        }
    }
}
