using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Load .env file early
DotNetEnv.Env.Load();

builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
// Add CORS
builder.Services.AddCors();
// Add service for exception
builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
    //opt.User.Password.RequiredLength = 6; // can configure password if needed
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();

var app = builder.Build();

// Configure the HTTP request pipeline or middleware.
// Order of code is important here

app.UseMiddleware<ExceptionMiddleware>(); // this mus be in top
// app.UseDeveloperExceptionPage(); // something that is already added except we create our own

app.UseCors(opt =>
{
    //opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:3000");
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://localhost:3000");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGroup("api").MapIdentityApi<User>(); // api/login, this will give access to api endpoints for User entity

DbInitializer.InitDb(app);

app.Run();









// ----- Removed -----

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi(); (will not be covered)

// HTTP request pipeline or middleware
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

// app.UseHttpsRedirection();

// app.UseAuthorization();