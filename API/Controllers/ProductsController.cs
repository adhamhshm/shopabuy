using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController(StoreContext context) : BaseApiController
    {

        [HttpGet] //https://localhost:5001/api/products
        public async Task<ActionResult<List<Product>>> GetProducts(
            [FromQuery] ProductParams productParams)
        {
            var query = context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable();

            // ToListAsync() is used in the ToPagedList()
            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.Metadata);

            return products;
        }
        // public async Task<ActionResult<List<Product>>> GetProducts()
        // {
        //     return await context.Products.ToListAsync();
        // }

        [HttpGet("{id}")] //https://localhost:5001/api/products/123
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id); //can return something or nothing (null)

            if (product == null) return NotFound(); //check for null

            return product;
        }
        
        // for filtering get API, notice how it gets the distinct brands and types from the products
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters() 
        {
            var brands = await context.Products.Select(x => x.Brand).Distinct().ToListAsync();
            var types = await context.Products.Select(x => x.Type).Distinct().ToListAsync();

            return Ok(new {brands, types});
        }
    }
}

// before
// public class ProductsController : ControllerBase
// {
//     private readonly StoreContext context;

//     public ProductsController(StoreContext context)
//     {
//         this.context = context;
//     }

//     [HttpGet]
//     public ActionResult<List<Product>> GetProducts()
//     {

//     }
// }

// after (using the primary constructor)
// public class ProductsController(StoreContext context) : ControllerBase
// {
//     [HttpGet]
//     public ActionResult<List<Product>> GetProducts()
//     {

//     }
// }
