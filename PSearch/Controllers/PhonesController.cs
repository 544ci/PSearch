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
using PSearchAPI.Models;

namespace PSearch.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PhonesController : ControllerBase
    {
        private string userId;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _context;

        public PhonesController(ApplicationDbContext context,
             IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
        }

        // GET: api/Phones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Phone>>> GetPhone()
        {
              return await _context.Phone.Where(e => e.UserRef==userId).ToListAsync();
        }




        // DELETE: api/Phones/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Phone>> DeletePhone(string id)
        {
            bool userOwnsPhone = _context.Phone.Any(p => p.DeviceId == id && p.UserRef==userId);
            if (userOwnsPhone)
            {
                var phone = await _context.Phone.FindAsync(id);
                if (phone == null)
                {
                    return NotFound();
                }

                _context.Phone.Remove(phone);
                await _context.SaveChangesAsync();

                return phone;
            }
            else
            {
                return Unauthorized();
            }
        }

        private bool PhoneExists(string id)
        {
            return _context.Phone.Any(e => e.DeviceId == id);
        }
    }
}
