using PSearch.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using static IdentityServer4.Models.IdentityResources;
using PSearchAPI.Models;
using Microsoft.AspNetCore.Http;

namespace PSearch.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {

        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Request>().HasKey(req => new { req.PhoneRefId, req.RequestId });
        }

        public DbSet<Location> Locations { get; set; }
        public DbSet<SMS> Messages { get; set; }
        public DbSet<Image> Image { get; set; }
        public DbSet<PSearchAPI.Models.Phone> Phone { get; set; }
        public DbSet<Location> Location { get; set; }
        public DbSet<CallLog> CallLog { get; set; }
        public DbSet<SMS> SMS { get; set; }
        public DbSet<Request> Request { get; set; }
        public DbSet<Video> Video{ get; set; }


    }
}
