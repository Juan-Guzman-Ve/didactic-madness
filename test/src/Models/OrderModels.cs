namespace CubeAutomate.Models;

public sealed record CheckoutRequest(int AddressId);

public sealed record OrderResponse(
    int Id,
    string OrderNumber,
    int UserId,
    int AddressId,
    string Status,
    decimal TotalAmount,
    string PaymentStatus);
