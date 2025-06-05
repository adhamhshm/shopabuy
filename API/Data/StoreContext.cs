using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

// This class defines the Entity Framework Core database context for the application,
// which also includes support for ASP.NET Core Identity through IdentityDbContext.
// The context is configured using dependency injection with DbContextOptions.
public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    // DbSet for products — this will map to the Products table in the database
    public required DbSet<Product> Products { get; set; }

    // DbSet for baskets — this will map to the Baskets table in the database
    public required DbSet<Basket> Baskets { get; set; }

    // This method is used to configure the model and seed initial data when the database is created.
    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Call the base method to ensure the default Identity model configuration is applied
        base.OnModelCreating(builder);

        // Seed initial roles into the IdentityRole table
        builder.Entity<IdentityRole>()
            .HasData(
                // Create a "Member" role with a predefined ID
                new IdentityRole 
                { 
                    Id = "e069461a-10cf-4abf-9930-d070b2a7e40f", 
                    Name = "Member", 
                    NormalizedName = "MEMBER" 
                },

                // Create an "Admin" role with a predefined ID
                new IdentityRole 
                { 
                    Id = "ed2e9149-fa53-484c-a93f-bd33f9e9fcf6", 
                    Name = "Admin", 
                    NormalizedName = "ADMIN" 
                }
            );
    }
}


// Old Code Snippet
// public class StoreContext(DbContextOptions options) : DbContext(options)
// {
//     public required DbSet<Product> Products { get; set; }
//     public required DbSet<Basket> Baskets { get; set; }
// }

// public class StoreContext : DbContext
// {
//     public StoreContext(DbContextOptions options)
//     {
        
//     }
// }
