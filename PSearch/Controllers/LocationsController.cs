using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSearch.Data;
using PSearch.Models;
using PSearchAPI.Models;

namespace PSearch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        private string userId;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _context;

        public LocationsController(ApplicationDbContext context,
             IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
        }



        // GET: api/Locations/5
        [Authorize]
        [HttpGet("{id}")]
        public ActionResult<Location> GetLocation(string id)
        {
            
            var locations =  _context.Location.Where(e=> e.PhoneRefId.Equals(id)).ToList();

            if (locations == null)
            {
                return NotFound();
            }

            return Ok(locations);
        }


        [Authorize(AuthenticationSchemes = JWTConstants.AuthSchemes)]
        [HttpPost]
        public async Task<ActionResult<Location>> PostLocation(Location location)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            location.Time = DateTime.Now;
            _context.Location.Add(location);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLocation", new { id = location.Id }, location);
        }


        private bool LocationExists(int id)
        {
            return _context.Location.Any(e => e.Id == id);
        }
    }
}
