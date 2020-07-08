using PSearch.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PSearchAPI.Models
{
    public class Phone
    {
        [Key, Required]
        public string DeviceId { get; set; }

        public string Model { get; set; }

        public string? Manufacturer { get; set; }

        [Required]
        public string UserRef { get; set; }
        
        [DefaultValue(true)]
        public bool enabled { get; set; }

        public string EncryptionKey { get; set; }

        [ForeignKey("PhoneRefId")]
        public ICollection<Location> Locations { get; set; }

        [ForeignKey("PhoneRefId")]
        public ICollection<SMS> Messages { get; set; }

        [ForeignKey("PhoneRefId")]
        public ICollection<Image> Images { get; set; }

        [ForeignKey("PhoneRefId")]
        public ICollection<CallLog> CallLogs { get; set; }

        [ForeignKey("PhoneRefId")]
        public ICollection<Request> Requests { get; set; }

        [ForeignKey("PhoneRefId")]
        public ICollection<Video> Videos { get; set; }

    }
}