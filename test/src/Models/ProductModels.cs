namespace CubeAutomate.Models;

public sealed record CategoryResponse(int Id, string Name, string Description, string Slug);

public sealed record ProductResponse(
    int Id,
    string Sku,
    int CategoryId,
    string Name,
    string Brand,
    decimal Price,
    int Stock,
    string Status);
