using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Hosting;

namespace GenericWebServerInitializer
{
    public static class UseSerilog
    {
        public static IHostBuilder ConfigureGenericHost(this IHostBuilder hostBuilder)
        {
            hostBuilder
                .UseContentRoot(Directory.GetCurrentDirectory())
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    config
                        .SetBasePath(hostingContext.HostingEnvironment.ContentRootPath)
                        .AddJsonFile("appsettings.json", true, true)
                        .AddJsonFile($"appsettings.{hostingContext.HostingEnvironment.EnvironmentName}.json",
                            true, true)
                        .AddJsonFile("hosting.json", optional: true)
                        .AddEnvironmentVariables();
                })
            //    .ConfigureLogging(loggingConfiguration => loggingConfiguration.ClearProviders())
            //.UseSerilog((hostingContext, loggerConfiguration) =>
            //    loggerConfiguration.ReadFrom.Configuration(hostingContext.Configuration));
                .ConfigureLogging((hostingContext, loggingBuilder) =>
                {
                    loggingBuilder.ClearProviders();
                    loggingBuilder.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                    loggingBuilder.AddConsole();
                    loggingBuilder.AddDebug();
                })
                .UseSerilog((builderContext, config) =>
                {
                    config.ReadFrom.Configuration(builderContext.Configuration)
                        .MinimumLevel.Information()
                        .Enrich.FromLogContext()
                        .WriteTo.Console();
                });
            return hostBuilder;
        }
        public static IWebHostBuilder ConfigureGenericWebHost(this IWebHostBuilder webHostBuilder)
        {
            webHostBuilder.ConfigureKestrel((context, serverOptions) =>
            {
                var kestrelSection = context.Configuration.GetSection("Kestrel");
                serverOptions.Configure(kestrelSection);
                //                            serverOptions.Listen(IPAddress.Loopback, 50000);
                //                            serverOptions.Listen(IPAddress.Loopback, 50001, 
                //                                listenOptions =>
                //                                {
                //                                    listenOptions.UseHttps("testCert.pfx", 
                //                                        "testPassword");
                //                                });
            });
            return webHostBuilder;
        }

    }
}
}
