using System;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await RetrieveBasket();

        if (basket == null) return NoContent();

        return basket.ToDto();

        // Moved to the Extensions folder
        // return new BasketDto
        // {
        //     BasketId = basket.BasketId,
        //     Items = basket.Items.Select(x => new BasketItemDto
        //     {
        //         ProductId = x.ProductId,
        //         Name = x.Product.Name,
        //         Price = x.Product.Price,
        //         Brand = x.Product.Brand,
        //         Type = x.Product.Type,
        //         PictureUrl = x.Product.PictureUrl,
        //         Quantity = x.Quantity,
        //     }).ToList()
        // };
    }

    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
        // get basket
        var basket = await RetrieveBasket();
        // create basket
        basket ??= CreateBasket();
        // get product
        var product = await context.Products.FindAsync(productId);
        // check if product is null, return a bad request
        if (product == null) return BadRequest("Problem adding item to basket.");
        // add item to basket
        basket.AddItem(product, quantity);
        // save changes
        var result = await context.SaveChangesAsync() > 0;
        if (result) return CreatedAtAction(nameof(GetBasket), basket.ToDto());

        return BadRequest("Problem updating basket.");
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
        // get basket
        var basket = await RetrieveBasket();
        if (basket == null) return BadRequest("Unable to retrieve basket");
        // remove the basket
        basket.RemoveItem(productId, quantity);
        // save changes
        var result = await context.SaveChangesAsync() > 0;
        if (result) return Ok();

        return BadRequest("Problem updating basket");
    }

    private Basket CreateBasket()
    {
        // generate GUID string
        var basketId = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions
        {
            // add cookie configuration
            IsEssential = true,
            Expires = DateTime.UtcNow.AddDays(30)
        };
        Response.Cookies.Append("basketId", basketId, cookieOptions);
        var basket = new Basket { BasketId = basketId };
        // EF is told to track this new entity
        context.Baskets.Add(basket);
        // Not saved until SaveChangesAsync() is called
        return basket;
    }

    private async Task<Basket?> RetrieveBasket()
    {
        return await context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.BasketId == Request.Cookies["basketId"]);
    }

    // Old GetBasket() method
    // [HttpGet]
    // public async Task<ActionResult<Basket>> GetBasket()
    // {
    //     var basket = await context.Baskets
    //         .Include(x => x.Items)
    //         .ThenInclude(x => x.Product)
    //         .FirstOrDefaultAsync(x => x.BasketId == Request.Cookies["basketId"]);

    //     if (basket == null) return NoContent();

    //     return basket;
    // }
}