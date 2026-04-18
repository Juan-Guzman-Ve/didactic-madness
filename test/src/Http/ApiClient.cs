using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using CubeAutomate.Models;

namespace CubeAutomate.Http;

public sealed class ApiClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _http;

    public ApiClient(string baseUrl)
    {
        _http = new HttpClient { BaseAddress = new Uri(baseUrl) };
    }

    public void Authorize(string token) =>
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

    public async Task<T> GetAsync<T>(string path)
    {
        var response = await _http.GetAsync(path);
        response.EnsureSuccessStatusCode();
        return await Unwrap<T>(response);
    }

    public async Task<PaginatedResponse<T>> GetPagedAsync<T>(string path)
    {
        var response = await _http.GetAsync(path);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<PaginatedResponse<T>>(JsonOptions))!;
    }

    public async Task<T> PostAsync<T>(string path, object body)
    {
        var response = await _http.PostAsJsonAsync(path, body, JsonOptions);
        response.EnsureSuccessStatusCode();
        return await Unwrap<T>(response);
    }

    public async Task<T> PutAsync<T>(string path, object body)
    {
        var response = await _http.PutAsJsonAsync(path, body, JsonOptions);
        response.EnsureSuccessStatusCode();
        return await Unwrap<T>(response);
    }

    private static async Task<T> Unwrap<T>(HttpResponseMessage response)
    {
        var wrapper = await response.Content.ReadFromJsonAsync<DataWrapper<T>>(JsonOptions);
        return wrapper!.Data;
    }
}

internal sealed record DataWrapper<T>(T Data);
