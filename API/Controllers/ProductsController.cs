using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")] //https://localhost:5001/api
    [ApiController]
    public class ProductsController(StoreContext context) : ControllerBase
    {

        [HttpGet] //https://localhost:5001/api/products
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            return await context.Products.ToListAsync();
        }

        [HttpGet("{id}")] //https://localhost:5001/api/products/123
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id); //can return something or nothing (null)

            if (product == null) return NotFound(); //check for null

            return product;
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
