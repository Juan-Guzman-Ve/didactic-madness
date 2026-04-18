using Bogus;
using CubeAutomate.Http;
using CubeAutomate.Models;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace CubeAutomate.Features.UserFlow;

/// <summary>
/// End-to-end user flow tests for the TechStore API.
///
/// PREREQUISITES:
///   - API must be running at the URL configured in appsettings.test.json
///   - Database seeds must be applied (database/sql/seeds/)
///
/// KNOWN API LIMITATION:
///   GET /cart is not user-scoped — it returns all cart items in the database.
///   Because of this, the shopping flow test requires john.doe@example.com to
///   have at least one cart item from the seed data. After checkout runs his cart
///   is cleared; re-apply seeds to restore test state.
/// </summary>
public sealed class UserFlowTests
{
    private readonly ApiClient _api;
    private readonly IConfiguration _config;

    public UserFlowTests()
    {
        _config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.test.json")
            .Build();

        var baseUrl = _config["Api:BaseUrl"]
            ?? throw new InvalidOperationException("Api:BaseUrl is not configured in appsettings.test.json");

        _api = new ApiClient(baseUrl);
    }

    // -------------------------------------------------------------------------
    // Story 1: A brand-new customer signs up and can log back in
    // -------------------------------------------------------------------------

    [Fact]
    public async Task A_new_customer_can_register_and_sign_in_to_their_account()
    {
        var persona = BuildFreshPersona();

        var account = await CustomerRegisters(persona);
        var session = await CustomerLogsIn(persona.Email, persona.Password);

        session.User.Id.Should().Be(account.Id);
        session.User.Email.Should().Be(persona.Email);
        session.User.Status.Should().Be("Active");
    }

    // -------------------------------------------------------------------------
    // Story 2: A returning customer browses the catalog, fills their cart,
    //          checks out, and tracks the resulting order
    // -------------------------------------------------------------------------

    [Fact]
    public async Task A_returning_customer_can_browse_fill_their_cart_and_place_an_order()
    {
        var email    = _config["TestPersona:Email"]    ?? "john.doe@example.com";
        var password = _config["TestPersona:Password"] ?? "Password123!";

        var session = await CustomerLogsIn(email, password);
        _api.Authorize(session.AccessToken);

        var product = await CustomerBrowsesAndPicksAnInStockProduct();
        var cartId  = await CustomerDiscoversTheirCartId();

        await CustomerSyncsCartWith(cartId, product);

        var address = await CustomerGetsTheirDefaultAddress();
        var order   = await CustomerChecksOut(address.Id);

        await CustomerConfirmsOrderIsTracked(order.Id, session.User.Id);
    }

    // =========================================================================
    // Story 1 — steps
    // =========================================================================

    private async Task<RegisterResult> CustomerRegisters(Persona persona)
    {
        var request = new RegisterRequest(persona.Email, persona.Password, persona.FirstName, persona.LastName);
        var result  = await _api.PostAsync<RegisterResult>("auth/register", request);

        result.Id.Should().BePositive();
        result.Email.Should().Be(persona.Email);
        result.Status.Should().Be("Active");

        return result;
    }

    private async Task<LoginResult> CustomerLogsIn(string email, string password)
    {
        var result = await _api.PostAsync<LoginResult>("auth/login", new LoginRequest(email, password));

        result.AccessToken.Should().NotBeNullOrWhiteSpace();
        result.User.Email.Should().Be(email);

        return result;
    }

    // =========================================================================
    // Story 2 — steps
    // =========================================================================

    private async Task<ProductResponse> CustomerBrowsesAndPicksAnInStockProduct()
    {
        var categories = await _api.GetPagedAsync<CategoryResponse>("categories");
        categories.Data.Should().NotBeEmpty("catalog must have at least one category");

        var firstCategory = categories.Data.First();

        var products = await _api.GetPagedAsync<ProductResponse>(
            $"products?categoryId={firstCategory.Id}&inStock=true&limit=1");

        products.Data.Should().NotBeEmpty(
            "at least one in-stock product must exist — re-apply seeds if needed");

        var product = products.Data.First();
        product.Stock.Should().BePositive();

        return product;
    }

    private async Task<int> CustomerDiscoversTheirCartId()
    {
        // NOTE: GET /cart is not user-scoped (known API limitation).
        // This step relies on john.doe having at least one seeded cart item.
        // If this assertion fails, re-apply database/sql/seeds/003-test-products.sql.
        var cart = await _api.GetPagedAsync<CartItemResponse>("cart");

        cart.Data.Should().NotBeEmpty(
            "john.doe must have seeded cart items — re-apply seeds if the cart is empty");

        return cart.Data.First().CartId;
    }

    private async Task<CartItemResponse[]> CustomerSyncsCartWith(int cartId, ProductResponse product)
    {
        var command = new SyncCartRequest(cartId, [new CartItemRequest(product.Id, 1)]);
        var items   = await _api.PutAsync<CartItemResponse[]>("cart", command);

        items.Should().NotBeEmpty();
        items.Should().ContainSingle(i => i.ProductId == product.Id);

        return items;
    }

    private async Task<AddressResponse> CustomerGetsTheirDefaultAddress()
    {
        var addresses = await _api.GetPagedAsync<AddressResponse>("addresses");

        addresses.Data.Should().NotBeEmpty(
            "the test user must have at least one saved address");

        var address = addresses.Data.First(a => a.IsDefault);
        return address;
    }

    private async Task<OrderResponse> CustomerChecksOut(int addressId)
    {
        var order = await _api.PostAsync<OrderResponse>("checkout", new CheckoutRequest(addressId));

        order.Id.Should().BePositive();
        order.OrderNumber.Should().StartWith("ORD-");
        order.Status.Should().NotBeNullOrWhiteSpace();
        order.TotalAmount.Should().BePositive();

        return order;
    }

    private async Task CustomerConfirmsOrderIsTracked(int orderId, int userId)
    {
        var order = await _api.GetAsync<OrderResponse>($"orders/{orderId}");

        order.Id.Should().Be(orderId);
        order.UserId.Should().Be(userId);
        order.OrderNumber.Should().StartWith("ORD-");

        var orderList = await _api.GetPagedAsync<OrderResponse>("orders");
        orderList.Data.Should().Contain(o => o.Id == orderId);
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    private sealed record Persona(string Email, string Password, string FirstName, string LastName);

    private static Persona BuildFreshPersona()
    {
        var faker = new Faker();
        return new Persona(
            faker.Internet.Email(),
            "Password123!",
            faker.Name.FirstName(),
            faker.Name.LastName());
    }
}
