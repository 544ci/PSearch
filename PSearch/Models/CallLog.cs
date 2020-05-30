using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace PSearchAPI.Models
{
    public class CallLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string PhoneRefId { get; set; }
        public string Call_From { get; set; }
        public string Call_to { get; set; }
        public float Duration { get; set; }
        public string Status { get; set; }
        public DateTime Date { get; set; }
    }
}