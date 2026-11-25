using CustomerPortal.Application.Customers;
using CustomerPortal.Infrastructure;
using CustomerPortal.WebAPI.Middleware;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

if (!builder.Environment.IsDevelopment())
    throw new InvalidOperationException("This unauthenticated demo may only run in Development.");

var connectionString = builder.Configuration.GetConnectionString("CustomerPortal")
    ?? throw new InvalidOperationException("Configure ConnectionStrings:CustomerPortal before starting the API.");

builder.Services.AddDbContext<CustomerDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IValidator<CreateCustomerRequest>, CreateCustomerValidator>();
builder.Services.AddScoped<IValidator<UpdateCustomerRequest>, UpdateCustomerValidator>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, $"{typeof(Program).Assembly.GetName().Name}.xml"));
});
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<CustomerExceptionHandler>();

var app = builder.Build();
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
app.Run();

/// <summary>Application entry point exposed for integration testing.</summary>
public partial class Program { }
