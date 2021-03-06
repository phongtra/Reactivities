using System;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistent;
using Serilog;
using Serilog.Core;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .CreateLogger();
            var host = CreateHostBuilder(args).Build();
           using (var scope = host.Services.CreateScope())
           {
               var services = scope.ServiceProvider;
               try
               {
                   var context = services.GetRequiredService<DataContext>();
                   var userManager = services.GetRequiredService<UserManager<AppUser>>();
                   context.Database.Migrate();
                   await Seed.SeedData(context, userManager);
               }
               catch (Exception e)
               {
                   var logger = services.GetRequiredService<ILogger<Program>>();
                   logger.LogError(e, "An error during migration");
               }
           }
           host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
