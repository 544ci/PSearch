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
    public class SMSController : ControllerBase
    {
        private string userId;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _context;

        public SMSController(ApplicationDbContext context,
             IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
        }


        // GET: api/SMS
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<SMS>>> GetSMS(string id)
        {
            bool userOwnsPhone = _context.Phone.Any(p => p.UserRef == userId && p.DeviceId == id);
            if (userOwnsPhone) { 
                var sms = _context.Messages.Where(e => e.PhoneRefId.Equals(id)).ToList();
            if (sms == null)
            {
                return NotFound();
            }
            return Ok(sms);
            }else{
                return Unauthorized();
            }
        }


        [Authorize(AuthenticationSchemes = JWTConstants.AuthSchemes)]
        [HttpPost("{id}")]
        public async Task<ActionResult<SMS>> PostSMS(Smss smss,string id)
        {
            String usrId = _context.Users.First(e => e.Email == userId).Id;
            bool userOwnsPhone = _context.Phone.Any(e => e.DeviceId == id && e.UserRef == usrId);
            if (userOwnsPhone)
            {
                List<SMS> s = _context.SMS.Where(e => e.PhoneRefId == id).ToList();
                foreach (SMS c in s)
                {
                    _context.SMS.Remove(c);
                }
                _context.SMS.AddRange(smss.smss);
                await _context.SaveChangesAsync();

                return Ok("{}");
            }
            else
            {
                return Unauthorized();
            }
        }


        private bool SMSExists(int id)
        {
            return _context.SMS.Any(e => e.Id == id);
        }
    }
    public class Smss
    {
        public List<SMS> smss { get; set; }
    }
}
