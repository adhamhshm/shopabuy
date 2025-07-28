using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController(StoreContext context, ImageService imageService, IMapper mapper) : BaseApiController
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

            return Ok(new { brands, types });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
        {
            var product = mapper.Map<Product>(productDto);

            if (productDto.File != null)
            {
                var imageResult = await imageService.AddImageAsync(productDto.File);

                if (imageResult.Error != null)
                {
                    return BadRequest(imageResult.Error.Message);
                }

                product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
                product.PublicId = imageResult.PublicId;
            }

            context.Products.Add(product);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return CreatedAtAction(nameof(GetProduct), new { Id = product.Id }, product);

            return BadRequest("Problem creating new procuct");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateProduct(UpdateProductDto updateProductDto)
        {
            var product = await context.Products.FindAsync(updateProductDto.Id);

            if (product == null) return NotFound();

            mapper.Map(updateProductDto, product);

            if (updateProductDto.File != null) 
            {
                var imageResult = await imageService.AddImageAsync(updateProductDto.File);

                if (imageResult.Error != null)
                    return BadRequest(imageResult.Error.Message);

                if (!string.IsNullOrEmpty(product.PublicId))
                    await imageService.DeleteImageAsync(product.PublicId);

                product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
                product.PublicId = imageResult.PublicId;
            }

            var result = await context.SaveChangesAsync() > 0;

            if (result) return NoContent();

            return BadRequest("Problem updating product");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await context.Products.FindAsync(id);

            if (product == null) return NotFound();

            if (!string.IsNullOrEmpty(product.PublicId))
                    await imageService.DeleteImageAsync(product.PublicId);

            context.Products.Remove(product);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("Problem deleting the product");
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
