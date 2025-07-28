using API.Data;
using API.Entities;
using API.Middleware;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Load .env file early
DotNetEnv.Env.Load();

builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
// builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary")); // using .env directly
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(); // Add CORS
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddTransient<ExceptionMiddleware>(); // Add service for exception
builder.Services.AddScoped<PaymentsService>();
builder.Services.AddScoped<ImageService>();
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

app.UseDefaultFiles(); // Enables default file mapping on the current path
app.UseStaticFiles(); // Enables static file serving for the current request path

app.UseCors(opt =>
{

    //opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:3000");
    var clientWebApi = Environment.GetEnvironmentVariable("CLIENT_WEB_API");
    if (string.IsNullOrWhiteSpace(clientWebApi))
        throw new InvalidOperationException("CLIENT_WEB_API environment variable is not set.");
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins(clientWebApi);
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGroup("api").MapIdentityApi<User>(); // api/login, this will give access to api endpoints for User entity

app.MapFallbackToController("Index", "Fallback");

await DbInitializer.InitDb(app);

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