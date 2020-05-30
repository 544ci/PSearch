using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PSearch.Models
{
    public class Request
    {
        [Key]
        [Required]
        public int RequestId { get; set; }
        [Key]
        [Required]
        public string PhoneRefId { get; set; }
        [Required]
        public int Status { get; set; }
        public DateTime LastModified { get; set; }

    }
}
