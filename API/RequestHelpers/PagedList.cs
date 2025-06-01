using System;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    // Generic class for paginated lists that includes pagination metadata
    public class PagedList<T> : List<T>
    {
        // Constructor initializes the paginated list and sets the metadata
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            // Create pagination metadata based on total items, page size, and current page
            Metadata = new PaginationMetadata
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };

            // Add the paged items to the current list (inherited from List<T>)
            AddRange(items);
        }

        // Property to hold pagination metadata
        public PaginationMetadata Metadata { get; set; }

        // Factory method to create a paged list from an IQueryable source
        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
        {
            // Get the total number of items in the query
            var count = await query.CountAsync();

            // Fetch only the items for the current page
            var items = await query
                .Skip((pageNumber - 1) * pageSize) // Skip items from previous pages
                .Take(pageSize)                   // Take only items for the current page
                .ToListAsync();                   // Execute the query and return as a list

            // Return a new PagedList instance with items and metadata
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}
