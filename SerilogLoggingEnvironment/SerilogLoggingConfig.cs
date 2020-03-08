using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Serilog;

namespace SerilogLoggingEnvironment
{
    public static class SerilogLoggingConfig
    {
        public static IApplicationBuilder UseLoggerConfig(this IApplicationBuilder app, IHostingEnvironment env)
        {

            var callingAppName = env.ApplicationName;

            var path = $"{callingAppName}/logfile.log";

            //add serilog https://github.com/serilog/serilog-extensions-logging
            // https://github.com/serilog/serilog-extensions-logging/blob/dev/samples/Sample/Program.cs
            Log.Logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .CreateLogger();

            var startTime = DateTimeOffset.UtcNow;

            Log.Logger.Information("Started at {StartTime} and 0x{Hello:X} is hex of 42", startTime, 42);

            return app;
        }
    }
}
