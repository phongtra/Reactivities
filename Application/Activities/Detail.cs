using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
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
            var activity = await _context.Activities.FindAsync(request.Id);
            return activity;
        }
    }
}
