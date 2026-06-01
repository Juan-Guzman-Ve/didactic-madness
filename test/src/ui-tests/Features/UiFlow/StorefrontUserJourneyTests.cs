using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Playwright;
using System.Text.Json;
using Xunit;

namespace CubeAutomate.Features.UiFlow;

[Collection("UI Workflow")]
public sealed class StorefrontUserJourneyTests : IAsyncLifetime
{
    private sealed record ShopperUser(string FirstName, string LastName, string Email, string Password);

    private static class ConfigKeys
    {
        public const string UiBaseUrl = "Ui:BaseUrl";
        public const string PersonaEmail = "TestPersona:Email";
        public const string PersonaPassword = "TestPersona:Password";
        public const string StepDelayMs = "Ui:DemoStepDelayMs";
        public const string SceneDelayMs = "Ui:DemoSceneDelayMs";
        public const string Headless = "Ui:Headless";
        public const string SlowMoMs = "Ui:SlowMoMs";
    }

    private static class Routes
    {
        public const string LoginPath = "/auth/login";
        public const string RegisterPath = "/auth/register";
        public const string ProductsPath = "/products";
        public const string UnknownProductPath = "/products/99999";
        public const string OrdersPath = "/orders";
        public const string HomePattern = "**/";
        public const string LoginPattern = "**/auth/login";
        public const string RegisterPattern = "**/auth/register";
        public const string RegisteredLoginPattern = "**/auth/login?registered=true";
        public const string ProductsPattern = "**/products";
        public const string ProductDetailPattern = "**/products/*";
        public const string OrderConfirmationPattern = "**/orders/*/confirmation";
    }

    private static class Selectors
    {
        public const string HomeHeadline = "h1:has-text('Build Your')";
        public const string HomeCategoriesTitle = "h2:has-text('Shop by Category')";
        public const string ProductsLink = "a:has-text('Products')";
        public const string SignInLink = "a:has-text('Sign In')";
        public const string RegisterLink = "a:has-text('Register')";
        public const string LoginHeading = "h2:has-text('Sign in')";
        public const string RegisterHeading = "h2:has-text('Create an account')";
        public const string SuccessAlert = ".success-alert";
        public const string UserOrdersLink = "a:has-text('My Orders')";
        public const string CartIconLink = "a[aria-label='Cart']";
        public const string UserMenuButton = ".user-btn";
        public const string ProductsHeadline = "h1:has-text('All Products')";
        public const string AllProductsFilterButton = "button:has-text('All Products')";
        public const string CatalogSidebar = ".sidebar";
        public const string ProductBreadcrumb = ".breadcrumb";
        public const string ProductTitle = ".product-title";
        public const string ProductStockBadge = ".stock-badge";
        public const string ViewCartLink = "a:has-text('View Cart')";
        public const string CartHeadline = "h1:has-text('Shopping Cart')";
        public const string CartSummary = ".order-summary";
        public const string CheckoutLink = "a:has-text('Proceed to Checkout')";
        public const string ContinueShoppingLink = "a:has-text('Continue Shopping')";
        public const string ShippingAddressTitle = "h2:has-text('Shipping Address')";
        public const string PaymentTitle = "h2:has-text('Payment')";
        public const string MockPaymentCopy = "text=Credit Card ending in 4242";
        public const string OrderPlacedHeadline = "h1:has-text('Order Placed Successfully!')";
        public const string ViewOrderDetailsLink = "a:has-text('View Order Details')";
        public const string OrderSummaryTitle = "h3:has-text('Order Summary')";
        public const string OrderShippingTitle = "h3:has-text('Shipping Address')";
        public const string BackToOrdersLink = "a:has-text('Back to Orders')";
        public const string MyOrdersHeadline = "h1:has-text('My Orders')";
        public const string ViewDetailsLink = "a:has-text('View Details')";
        public const string OrderPaymentTitle = "h3:has-text('Payment')";
        public const string ErrorAlert = ".error-alert";
        public const string ProductNotFoundTitle = "h2:has-text('Product not found')";
        public const string BrowseProductsLink = "a:has-text('Browse Products')";
        public const string EnabledAddToCartButton = ".add-btn:not([disabled])";
        public const string ProductNameLink = ".product-name";
        public const string AddressOption = ".address-option";
        public const string EmailInput = "input[type='email']";
        public const string PasswordInput = "input[type='password']";
    }

    private static class UiText
    {
        public const string ShopComponents = "Shop Components";
        public const string Register = "Register";
        public const string SignIn = "Sign In";
        public const string SignInButton = "Sign in";
        public const string CreateAccountButton = "Create account";
        public const string AddToCartButton = "Add to Cart";
        public const string ProceedToCheckout = "Proceed to Checkout";
        public const string PlaceOrder = "Place Order";
        public const string AddNewAddress = "+ Add New Address";
        public const string SaveAddress = "Save Address";
        public const string FirstName = "First name";
        public const string LastName = "Last name";
        public const string StreetAddress = "Street Address";
        public const string City = "City";
        public const string State = "State / Province";
        public const string PostalCode = "Postal Code";
        public const string Country = "Country";
    }

    private const int DefaultExpectVisibleTimeoutMs = 10000;
    private IPlaywright _playwright = default!;
    private IBrowser _browser = default!;

    private string _uiBaseUrl = "http://localhost:4200";
    private string _personaEmail = "john.doe@example.com";
    private string _personaPassword = "Password123!";
    private int _stepDelayMs = 800;
    private int _sceneDelayMs = 1800;

    public async Task InitializeAsync()
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.test.json", optional: true)
            .Build();

        _uiBaseUrl = GetConfigString(config, ConfigKeys.UiBaseUrl, _uiBaseUrl);
        _personaEmail = GetConfigString(config, ConfigKeys.PersonaEmail, _personaEmail);
        _personaPassword = GetConfigString(config, ConfigKeys.PersonaPassword, _personaPassword);
        _stepDelayMs = GetConfigInt(config, ConfigKeys.StepDelayMs, _stepDelayMs);
        _sceneDelayMs = GetConfigInt(config, ConfigKeys.SceneDelayMs, _sceneDelayMs);

        var headless = GetConfigBool(config, ConfigKeys.Headless, defaultValue: false);
        var slowMoMs = GetConfigInt(config, ConfigKeys.SlowMoMs, defaultValue: 250);

        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = headless,
            SlowMo = slowMoMs,
            IgnoreDefaultArgs = ["--window-size=1280,720"],
            Args = ["--start-maximized"],
        });
    }

    public async Task DisposeAsync()
    {
        await _browser.CloseAsync();
        _playwright.Dispose();
    }

    [Fact(DisplayName = "Anonymous shopper can register, buy a product, and review order history")]
    public async Task AnonymousShopperCanRegisterBuyAndReviewOrderHistory()
    {
        await WithFreshPage(async page =>
        {
            var shopperUser = CreateShopperUser();

            await ShowThePublicStorefront(page);
            await RegisterANewShopper(page, shopperUser);
            await SignInAsTheNewShopper(page, shopperUser);
            await BrowseTheCatalog(page);
            await InspectTheFirstAvailableProduct(page);
            await AddTheProductToTheCart(page);
            await ReviewTheShoppingCart(page);
            await CompleteCheckout(page);
            await ReviewTheOrderConfirmation(page);
            await ReviewTheOrderHistory(page);
            await OpenTheLatestOrderDetails(page);
        });
    }

    [Theory(DisplayName = "Anonymous shopper is redirected to login for protected storefront routes")]
    [InlineData("/cart")]
    [InlineData("/checkout")]
    [InlineData("/orders")]
    [InlineData("/orders/1")]
    public async Task AnonymousShopperIsRedirectedWhenOpeningProtectedRoute(string protectedPath)
    {
        await WithFreshPage(async page =>
        {
            await page.GotoAsync(_uiBaseUrl + protectedPath);
            await page.WaitForURLAsync(Routes.LoginPattern);
            await ExpectVisible(page, Selectors.LoginHeading);
        });
    }

    [Fact(DisplayName = "Sign in shows a validation error when credentials are invalid")]
    public async Task SignInShowsErrorForInvalidCredentials()
    {
        await WithFreshPage(async page =>
        {
            await AttemptLoginWithInvalidCredentials(page);
        });
    }

    [Fact(DisplayName = "Unknown product page shows the not-found state")]
    public async Task UnknownProductPageShowsNotFoundState()
    {
        await WithFreshPage(async page =>
        {
            await ShowTheNotFoundStateForAnUnknownProduct(page);
        });
    }

    [Fact(DisplayName = "Anonymous shopper must sign in before adding a product to cart")]
    public async Task AnonymousShopperMustSignInBeforeAddingProductToCart()
    {
        await WithFreshPage(async page =>
        {
            await RedirectAnAnonymousShopperToLoginWhenAddingToCart(page);
        });
    }

    private ShopperUser CreateShopperUser()
    {
        return new ShopperUser(
            "Journey",
            "Student",
            $"shopper.{Guid.NewGuid():N}@example.com",
            "Password123!");
    }

    private async Task ShowThePublicStorefront(IPage page)
    {
        await OpenHome(page);
        await ExpectVisible(page, Selectors.HomeHeadline);
        await ExpectVisible(page, Selectors.HomeCategoriesTitle);
        await ExpectVisible(page, Selectors.ProductsLink);
        await ExpectVisible(page, Selectors.SignInLink);
        await ExpectVisible(page, Selectors.RegisterLink);
        await ScenePause(page);
    }

    private async Task RegisterANewShopper(IPage page, ShopperUser shopperUser)
    {
        await RegisterNewUser(page, shopperUser.FirstName, shopperUser.LastName, shopperUser.Email, shopperUser.Password);
        await ExpectVisible(page, Selectors.SuccessAlert);
        await ScenePause(page);
    }

    private async Task SignInAsTheNewShopper(IPage page, ShopperUser shopperUser)
    {
        await SignIn(page, shopperUser.Email, shopperUser.Password);
        await ExpectVisible(page, Selectors.UserOrdersLink);
        await ExpectVisible(page, Selectors.CartIconLink);
        await ExpectVisible(page, Selectors.UserMenuButton);
        await ScenePause(page);
    }

    private async Task BrowseTheCatalog(IPage page)
    {
        await OpenProducts(page);
        await ExpectVisible(page, Selectors.ProductsHeadline);
        await ExpectVisible(page, Selectors.AllProductsFilterButton);
        await ExpectVisible(page, Selectors.CatalogSidebar);
        await ScenePause(page);
    }

    private async Task InspectTheFirstAvailableProduct(IPage page)
    {
        await OpenFirstProduct(page);
        await ExpectVisible(page, Selectors.ProductBreadcrumb);
        await ExpectVisible(page, Selectors.ProductTitle);
        await ExpectVisible(page, Selectors.ProductStockBadge);
        await ScenePause(page);
    }

    private async Task AddTheProductToTheCart(IPage page)
    {
        await AddProductToCart(page);
        await ScenePause(page);
    }

    private async Task ReviewTheShoppingCart(IPage page)
    {
        await ClickWithPacing(page.GetByRole(AriaRole.Link, new() { Name = "View Cart" }), page);
        await ExpectVisible(page, Selectors.CartHeadline);
        await ExpectVisible(page, Selectors.CartSummary);
        await ExpectVisible(page, Selectors.CheckoutLink);
        await ExpectVisible(page, Selectors.ContinueShoppingLink);
        await ScenePause(page);
    }

    private async Task CompleteCheckout(IPage page)
    {
        await ClickWithPacing(page.GetByRole(AriaRole.Link, new() { Name = UiText.ProceedToCheckout }), page);
        await ExpectVisible(page, Selectors.ShippingAddressTitle);
        await ExpectVisible(page, Selectors.PaymentTitle);
        await ExpectVisible(page, Selectors.MockPaymentCopy);
        await EnsureShippingAddress(page);
        await ScenePause(page);

        await ClickWithPacing(page.GetByRole(AriaRole.Button, new() { Name = UiText.PlaceOrder }), page);
        await page.WaitForURLAsync(Routes.OrderConfirmationPattern);
    }

    private async Task ReviewTheOrderConfirmation(IPage page)
    {
        await ExpectVisible(page, Selectors.OrderPlacedHeadline);
        await ExpectVisible(page, Selectors.ViewOrderDetailsLink);
        await ScenePause(page);
    }

    private async Task ReviewTheOrderHistory(IPage page)
    {
        await ClickWithPacing(page.GetByRole(AriaRole.Link, new() { Name = "View Order Details" }), page);
        await ExpectVisible(page, Selectors.OrderSummaryTitle);
        await ExpectVisible(page, Selectors.OrderShippingTitle);
        await ExpectVisible(page, Selectors.BackToOrdersLink);
        await ScenePause(page);

        await ClickWithPacing(page.Locator(Selectors.BackToOrdersLink), page);
        await ExpectVisible(page, Selectors.MyOrdersHeadline);
        await ScenePause(page);
    }

    private async Task OpenTheLatestOrderDetails(IPage page)
    {
        if (await page.Locator(Selectors.ViewDetailsLink).CountAsync() == 0)
        {
            Require(false, "The happy path requires at least one order in the seed data.");
        }

        await ClickWithPacing(page.Locator(Selectors.ViewDetailsLink).First, page);
        await ExpectVisible(page, Selectors.OrderSummaryTitle);
        await ExpectVisible(page, Selectors.OrderPaymentTitle);
        await ScenePause(page);
    }

    private async Task AttemptLoginWithInvalidCredentials(IPage page)
    {
        await page.GotoAsync(_uiBaseUrl + Routes.LoginPath);
        await page.Locator(Selectors.EmailInput).FillAsync("nobody@example.com");
        await page.Locator(Selectors.PasswordInput).FillAsync("wrong-password");
        await page.GetByRole(AriaRole.Button, new() { Name = UiText.SignInButton }).ClickAsync();

        await ExpectVisible(page, Selectors.ErrorAlert);
        var errorMessage = await page.Locator(Selectors.ErrorAlert).InnerTextAsync();
        errorMessage.Should().Contain("Invalid email or password");
    }

    private async Task ShowTheNotFoundStateForAnUnknownProduct(IPage page)
    {
        await page.GotoAsync(_uiBaseUrl + Routes.UnknownProductPath);
        await ExpectVisible(page, Selectors.ProductNotFoundTitle);
        await ExpectVisible(page, Selectors.BrowseProductsLink);
    }

    private async Task RedirectAnAnonymousShopperToLoginWhenAddingToCart(IPage page)
    {
        await page.GotoAsync(_uiBaseUrl + Routes.ProductsPath);
        await ExpectVisible(page, Selectors.ProductsHeadline);

        if (await page.Locator(Selectors.EnabledAddToCartButton).CountAsync() == 0)
        {
            Require(false, "The login redirect scenario requires at least one in-stock product.");
        }

        await ClickWithPacing(page.Locator(Selectors.EnabledAddToCartButton).First, page);
        await page.WaitForURLAsync(Routes.LoginPattern);
        await ExpectVisible(page, Selectors.LoginHeading);
    }

    private async Task OpenHome(IPage page)
    {
        await page.GotoAsync(_uiBaseUrl);
    }

    private async Task OpenProducts(IPage page)
    {
        await ClickWithPacing(page.GetByRole(AriaRole.Link, new() { Name = UiText.ShopComponents }), page);
        await page.WaitForURLAsync(Routes.ProductsPattern);
    }

    private async Task OpenFirstProduct(IPage page)
    {
        if (await page.Locator(Selectors.ProductNameLink).CountAsync() == 0)
        {
            Require(false, "The journey requires at least one product in the catalog.");
        }

        await ClickWithPacing(page.Locator(Selectors.ProductNameLink).First, page);
        await page.WaitForURLAsync(Routes.ProductDetailPattern);
    }

    private async Task AddProductToCart(IPage page)
    {
        await ClickWithPacing(page.GetByRole(AriaRole.Button, new() { Name = UiText.AddToCartButton }), page);
        await ExpectVisible(page, Selectors.ViewCartLink);
    }

    private async Task RegisterNewUser(IPage page, string firstName, string lastName, string email, string password)
    {
        await ClickWithPacing(page.GetByRole(AriaRole.Link, new() { Name = UiText.Register }), page);
        await page.WaitForURLAsync(Routes.RegisterPattern);
        await ExpectVisible(page, Selectors.RegisterHeading);

        await page.GetByRole(AriaRole.Textbox, new() { Name = UiText.FirstName }).FillAsync(firstName);
        await StepPause(page);
        await page.GetByRole(AriaRole.Textbox, new() { Name = UiText.LastName }).FillAsync(lastName);
        await StepPause(page);
        await page.Locator(Selectors.EmailInput).FillAsync(email);
        await StepPause(page);
        await page.Locator(Selectors.PasswordInput).FillAsync(password);
        await StepPause(page);
        await ClickWithPacing(page.GetByRole(AriaRole.Button, new() { Name = UiText.CreateAccountButton }), page);
        await page.WaitForURLAsync(Routes.RegisteredLoginPattern);
    }

    private async Task SignIn(IPage page, string email, string password)
    {
        if (!page.Url.Contains(Routes.LoginPath, StringComparison.OrdinalIgnoreCase))
        {
            await ClickWithPacing(page.GetByRole(AriaRole.Link, new() { Name = UiText.SignIn }), page);
        }

        await page.WaitForURLAsync(Routes.LoginPattern);
        await page.Locator(Selectors.EmailInput).FillAsync(email);
        await StepPause(page);
        await page.Locator(Selectors.PasswordInput).FillAsync(password);
        await StepPause(page);
        await ClickWithPacing(page.GetByRole(AriaRole.Button, new() { Name = UiText.SignInButton }), page);
        await page.WaitForURLAsync(Routes.HomePattern);
        await StepPause(page);
    }

    private async Task EnsureShippingAddress(IPage page)
    {
        var addressOptions = page.Locator(Selectors.AddressOption);
        if (await addressOptions.CountAsync() > 0)
        {
            return;
        }

        await ClickWithPacing(page.GetByRole(AriaRole.Button, new() { Name = UiText.AddNewAddress }), page);
        await page.GetByRole(AriaRole.Textbox, new() { Name = UiText.StreetAddress }).FillAsync("742 Journey Avenue");
        await StepPause(page);
        await page.GetByRole(AriaRole.Textbox, new() { Name = UiText.City }).FillAsync("Santo Domingo");
        await StepPause(page);
        await page.GetByRole(AriaRole.Textbox, new() { Name = UiText.State }).FillAsync("Distrito Nacional");
        await StepPause(page);
        await page.GetByRole(AriaRole.Textbox, new() { Name = UiText.PostalCode }).FillAsync("10101");
        await StepPause(page);
        await page.GetByRole(AriaRole.Textbox, new() { Name = UiText.Country }).FillAsync("Dominican Republic");
        await StepPause(page);
        await ClickWithPacing(page.GetByRole(AriaRole.Button, new() { Name = UiText.SaveAddress }), page);
        await ExpectVisible(page, Selectors.AddressOption);
    }

    private async Task ClickWithPacing(ILocator locator, IPage page)
    {
        await locator.ScrollIntoViewIfNeededAsync();
        await StepPause(page);
        await locator.HoverAsync();
        await StepPause(page);
        await locator.ClickAsync();
        await StepPause(page);
    }

    private async Task WithFreshPage(Func<IPage, Task> scenario)
    {
        await using var context = await _browser.NewContextAsync(new BrowserNewContextOptions
        {
            BaseURL = _uiBaseUrl,
            IgnoreHTTPSErrors = true,
            ViewportSize = null,
        });

        var page = await context.NewPageAsync();
        await MaximizeBrowserWindow(page);
        await FitPageViewportToScreen(page);
        await scenario(page);
    }

    private static async Task FitPageViewportToScreen(IPage page)
    {
        var metrics = await page.EvaluateAsync<JsonElement?>("""
            () => {
              const width = Math.max(1, Math.floor(window.screen.availWidth || window.innerWidth || 1280));
              const height = Math.max(1, Math.floor(window.screen.availHeight || window.innerHeight || 720));
              return { width, height };
            }
            """);

        if (metrics is null
            || !metrics.Value.TryGetProperty("width", out var widthProperty)
            || !metrics.Value.TryGetProperty("height", out var heightProperty)
            || !widthProperty.TryGetInt32(out var width)
            || !heightProperty.TryGetInt32(out var height))
        {
            return;
        }

        await page.SetViewportSizeAsync(width, height);
    }

    private static async Task MaximizeBrowserWindow(IPage page)
    {
        // Keep viewport emulation disabled and request native maximize from Chromium.
        if (!string.Equals(page.Context.Browser?.BrowserType.Name, "chromium", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        var cdpSession = await page.Context.NewCDPSessionAsync(page);
        JsonElement? windowInfo;
        try
        {
            windowInfo = await cdpSession.SendAsync("Browser.getWindowForTarget");
        }
        catch
        {
            return;
        }

        if (windowInfo is null
            || !windowInfo.Value.TryGetProperty("windowId", out var windowIdProperty)
            || !windowIdProperty.TryGetInt32(out var windowId))
        {
            return;
        }

        await cdpSession.SendAsync("Browser.setWindowBounds", new Dictionary<string, object>
        {
            ["windowId"] = windowId,
            ["bounds"] = new Dictionary<string, object>
            {
                ["windowState"] = "maximized",
            },
        });

        await cdpSession.SendAsync("Emulation.clearDeviceMetricsOverride");
    }

    private async Task ExpectVisible(IPage page, string selector)
    {
        var locator = page.Locator(selector).First;
        await locator.WaitForAsync(new LocatorWaitForOptions
        {
            Timeout = DefaultExpectVisibleTimeoutMs,
            State = WaitForSelectorState.Visible,
        });
        (await locator.IsVisibleAsync()).Should().BeTrue();
        await StepPause(page);
    }

    private static void Require(bool condition, string reason)
    {
        if (!condition)
        {
            throw new InvalidOperationException(reason);
        }
    }

    private async Task StepPause(IPage page)
    {
        if (_stepDelayMs > 0)
        {
            await page.WaitForTimeoutAsync(_stepDelayMs);
        }
    }

    private async Task ScenePause(IPage page)
    {
        if (_sceneDelayMs > 0)
        {
            await page.WaitForTimeoutAsync(_sceneDelayMs);
        }
    }

    private static string GetConfigString(IConfiguration configuration, string key, string defaultValue)
    {
        var value = configuration[key];
        return string.IsNullOrWhiteSpace(value) ? defaultValue : value;
    }

    private static int GetConfigInt(IConfiguration configuration, string key, int defaultValue)
    {
        return int.TryParse(configuration[key], out var value) ? value : defaultValue;
    }

    private static bool GetConfigBool(IConfiguration configuration, string key, bool defaultValue)
    {
        return bool.TryParse(configuration[key], out var value) ? value : defaultValue;
    }
}
