namespace CubeAutomate.Models;

public sealed record CreateAddressRequest(
    int UserId,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string State,
    string PostalCode,
    string Country,
    bool IsDefault);

public sealed record AddressResponse(
    int Id,
    int UserId,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string State,
    string PostalCode,
    string Country,
    bool IsDefault);
