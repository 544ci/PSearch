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

    public class CallLogsController : ControllerBase
    {
        private string userId;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _context;
        public CallLogsController(ApplicationDbContext context,
             IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
        }


        // GET: api/CallLogs/5
        [Authorize]
        [HttpGet("{id}")]
        public ActionResult<CallLog> GetCallLog(string id)
        {
            bool userOwnsPhone = _context.Phone.Any(p => p.UserRef == userId && p.DeviceId == id);
            if (userOwnsPhone)
            {
                var callLogs = _context.CallLog.Where(e => e.PhoneRefId.Equals(id)).ToList();

                if (callLogs == null)
                {
                    return NotFound();
                }

                return Ok(callLogs);
            }
            else
            {
                return Unauthorized();
            }
        }

        // POST: api/CallLogs
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize(AuthenticationSchemes = JWTConstants.AuthSchemes)]
        [HttpPost("{id}")]
        public async Task<ActionResult<String>> PostCallLog( CallLogs callLogs,string id)
        {
            String usrId = _context.Users.First(e => e.Email == userId).Id;
            bool userOwnsPhone = _context.Phone.Any(e => e.DeviceId == id && e.UserRef == usrId);
            if (userOwnsPhone)
            {
                List<CallLog> calllogs = _context.CallLog.Where(e => e.PhoneRefId == id).ToList();
                foreach (CallLog c in calllogs)
                {
                    _context.CallLog.Remove(c);
                }
                _context.CallLog.AddRange(callLogs.callLogs);
                await _context.SaveChangesAsync();

                return Ok("{}");
            }
            else
            {
                return Unauthorized();
            }
        }

    

        private bool CallLogExists(int id)
        {
            return _context.CallLog.Any(e => e.Id == id);
        }


    }
    public class CallLogs
    {
        public List<CallLog> callLogs { get;set; }
    }
}
