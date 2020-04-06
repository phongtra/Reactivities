using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent;

namespace Application.Activities
{
    public class Detail
    {
        public class Query: IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }
        
    }

    public class Handler : IRequestHandler<Detail.Query, ActivityDto>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ActivityDto> Handle(Detail.Query request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities
                .FindAsync(request.Id);
            if (activity == null) throw new RestException(HttpStatusCode.NotFound, new {activity = "Not Found"});
            var activityToReturn = _mapper.Map<Activity, ActivityDto>(activity);
            return activityToReturn;
        }
    }
}
