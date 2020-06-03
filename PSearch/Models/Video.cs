using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PSearch.Models
{
    public class Video
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        [Required]
        public string PhoneRefId { get; set; }
        public bool Saved { get; set; }
        public TimeSpan Start { get; set; }
        public TimeSpan End { get; set; }
        public DateTime Date { get; set; }
    }
}
