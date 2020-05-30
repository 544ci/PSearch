using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PSearch.Models
{
    public class userManagement
    {
        [Required]
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string DeviceId { get; set; }
        public string Manufacturer { get; set; }
        public string Model { get; set; } 

    }
}
