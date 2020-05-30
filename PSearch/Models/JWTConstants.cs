using Microsoft.AspNetCore.Authentication.JwtBearer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSearch.Models
{
    public class JWTConstants
    {
        public const string Issuer = "MVS";
        public const string Audience = "ApiUser";
        public const string Key = "123123123123123123123123123";
        public const string AuthSchemes = "Identity.Application ,"+JwtBearerDefaults.AuthenticationScheme;
    }
}
