using System;
using System.Collections.Generic;
using System.Text;
using Domain;

namespace Application.Interfaces
{
    public interface IJwtGenerator
    {
        string CreateToken(AppUser user);
    }
}
