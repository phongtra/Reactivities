using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistent;

namespace Infrastructure.Security
{
    public class IsHostRequired: IAuthorizationRequirement
    {
    }
    public class IsHostRequirementHandler: AuthorizationHandler<IsHostRequired>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequired requirement)
        {

            var currentUser = _httpContextAccessor.HttpContext.User?.Claims
                ?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var activityId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues
                .SingleOrDefault(x => x.Key == "id").Value.ToString());
            var activity = _context.Activities.FindAsync(activityId).Result;
            var host = activity?.UserActivities?.FirstOrDefault(x => x.IsHost);
            if (host?.AppUser?.UserName == currentUser) context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
