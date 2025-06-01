using System;
using System.Text.Json;
using API.RequestHelpers;
using Microsoft.Net.Http.Headers;

namespace API.Extensions
{
    // This class contains extension methods for the HttpResponse object
    public static class HttpExtensions
    {
        // Extension method to add pagination metadata to the HTTP response headers
        public static void AddPaginationHeader(this HttpResponse response, PaginationMetadata metadata)
        {
            // Define JSON serialization options: convert property names to camelCase (e.g., TotalPages -> totalPages)
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            // Serialize the pagination metadata and add it to the "Pagination" header
            response.Headers.Append("Pagination", JsonSerializer.Serialize(metadata, options));

            // Expose the "Pagination" header to the client (browser) so it can be read via JavaScript
            response.Headers.Append(HeaderNames.AccessControlExposeHeaders, "Pagination");
        }
    }
}
