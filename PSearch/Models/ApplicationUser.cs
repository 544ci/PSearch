using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PSearchAPI.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PSearch.Models
{
    public class ApplicationUser : IdentityUser
    {

        [ForeignKey("UserRef")]
        public ICollection<Phone> Phones { get; set; }
    }
}
