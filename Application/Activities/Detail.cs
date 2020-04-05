using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent;

namespace Application.Activities
{
    public class Detail
    {
        public class Query: IRequest<Activity>
        {
            public Guid Id { get; set; }
        }
        
    }

    public class Handler : IRequestHandler<Detail.Query, Activity>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }
        public async Task<Activity> Handle(Detail.Query request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities
                .Include(x => x.UserActivities)
                .ThenInclude(x=> x.AppUser)
                .SingleOrDefaultAsync(x => x.Id == request.Id);
            if (activity == null) throw new RestException(HttpStatusCode.NotFound, new {activity = "Not Found"});
            return activity;
        }
    }
}
