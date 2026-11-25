using CustomerPortal.Application.Customers;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace CustomerPortal.WebAPI.Middleware;

internal sealed class CustomerExceptionHandler(ILogger<CustomerExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not CustomerEmailConflictException) return false;

        logger.LogWarning("A customer email conflict occurred.");
        context.Response.StatusCode = StatusCodes.Status409Conflict;
        await context.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = StatusCodes.Status409Conflict,
            Title = "Customer email already exists",
            Detail = "A customer with this email already exists."
        }, cancellationToken);
        return true;
    }
}
