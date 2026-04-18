namespace CubeAutomate.Models;

public sealed record RegisterRequest(string Email, string Password, string FirstName, string LastName);

public sealed record LoginRequest(string Email, string Password);

public sealed record UserDetails(int Id, string Email, string FirstName, string LastName, int RoleId, string Status);

public sealed record LoginResult(string AccessToken, UserDetails User);

public sealed record RegisterResult(int Id, string Email, string FirstName, string LastName, int RoleId, string Status);
