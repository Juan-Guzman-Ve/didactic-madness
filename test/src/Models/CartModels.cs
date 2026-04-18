namespace CubeAutomate.Models;

public sealed record CartItemRequest(int ProductId, int Quantity);

public sealed record SyncCartRequest(int CartId, CartItemRequest[] Items);

public sealed record CartItemResponse(int Id, int CartId, int ProductId, int Quantity);
