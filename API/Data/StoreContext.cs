using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

//using primary constructor
public class StoreContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<Product> Products { get; set; }
}

// public class StoreContext : DbContext
// {
//     public StoreContext(DbContextOptions options)
//     {
        
//     }
// }
