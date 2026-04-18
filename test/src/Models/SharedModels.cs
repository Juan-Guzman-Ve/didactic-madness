namespace CubeAutomate.Models;

public sealed record PaginationMeta(int Page, int Limit, int Total, int TotalPages);

public sealed record PaginatedResponse<T>(T[] Data, PaginationMeta Meta);
