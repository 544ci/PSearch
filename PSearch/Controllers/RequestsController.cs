using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSearch.Data;
using Microsoft.AspNetCore.Authorization;

using PSearch.Models;
using System.Security.Claims;
//4 failed
//3 complete
//2
//1 pending
namespace PSearch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private string userId;

        public RequestsController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;

        }

        // GET: api/Requests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequest()
        {
            return await _context.Request.ToListAsync();
        }
        [Authorize]
        [HttpGet("liveStream/{phoneId}")]
        public ActionResult<Object> liveStream(string phoneId)
        {
            bool phoneExists = _context.Phone.Any(p => p.UserRef == userId && p.DeviceId == phoneId);
            if (!phoneExists)
                return NotFound();
            bool streamReady = _context.Request.Any(r => r.PhoneRefId == phoneId && r.RequestId == 6 && r.Status == 3);
            if (streamReady)
            {
                return Ok(new { url = $"http://localhost:8000/live/{phoneId}.flv" });
            }
            else
            {
                return NoContent();
            }
        }
        [Authorize(AuthenticationSchemes = JWTConstants.AuthSchemes)]
        [HttpGet("{id}")]
        public ActionResult<Object> GetRequest(string id)
        {
            var userEmail= _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userId = _context.Users.Where(e => e.Email == userEmail).Select(u => u.Id).FirstOrDefault(); ;

            bool phoneExists = _context.Phone.Any(p => p.UserRef == userId && p.DeviceId == id);
            if (!phoneExists)
                return NotFound();
            List<Request> requests = _context.Request.Where(r => r.PhoneRefId == id && r.Status==1).ToList();
            if (containsResetRequest(requests))
            {
                Request resetRequest = _context.Request.First(e => e.RequestId == 3 && e.Status == 1 && e.PhoneRefId==id);
                resetRequest.Status = 3;
                _context.Request.Update(resetRequest);
                _context.SaveChanges();
            }
            foreach(Request r in requests)
            {
                if (r.RequestId != 3)
                {
                    r.Status = 2;
                    _context.Request.Update(r);
                }
}
            return Ok(new { requests });
        }
        [Authorize]
        [HttpPost("{id}")]
        public  ActionResult<Request> PostRequest([FromBody]Request request,string id)
        {
            bool userOwnsPhone = _context.Phone.Any(p => p.DeviceId == id && p.UserRef == userId);
            if (userOwnsPhone)
            {
                return handleRequest(request);
            }
            else
            {
                return Unauthorized();
            }

        }

        private ActionResult<Request> handleRequest(Request request)
        {       
            if (!RequestExists(request))
            {
                try
                {
                    if (request.RequestId == 2)
                        if (IsPhoneEncrypted(request.PhoneRefId))
                        {
                            addRequest(request);
                            return Ok("{\"message\": \"" + getRequestName(request.RequestId) + " Request Queued\"}");
                        }
                        else
                        {
                            return BadRequest("{\"message\": \" Phone not encrypted\"}");
                        }
                    else
                    {
                        addRequest(request);
                        return Ok("{\"message\": \"" + getRequestName(request.RequestId) + " Request Queued\"}");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                Request req = _context.Request.First(e => e.RequestId == request.RequestId && e.PhoneRefId == request.PhoneRefId);

                if (req.Status == 1)
                    if (ValidRequest(request))
                    {
                        updateRequest(req);
                        return Ok("{\"message\": \"" + getRequestName(request.RequestId) + " Request Queued\"}");
                    }
                    else if (req.RequestId == 1)
                        return BadRequest("{\"message\": \"Phone already encrypted\"}");
                    else
                        return BadRequest("{\"message\": \"Phone not Encrypted\"}");
                else if (req.Status == 2)
                {
                    return Ok("{\"message\": \"" + getRequestName(request.RequestId) + " Request Sent To Phone\"}");
                }
                else if (req.Status == 3)
                {
                    if (ValidRequest(request))
                    {
                        req.Status = 1;
                        updateRequest(req);
                        return Ok("{\"message\": \"" + getRequestName(request.RequestId) + " Request Queued\"}");
                    }
                    else
                    {
                        if (request.RequestId == 1)
                            return BadRequest("{\"message\": \"Phone already encrypted\"}");
                        return BadRequest("{\"message\": \"Phone not encrypted\"}");


                    }
                }
                else
                {


                    if (ValidRequest(request))
                    {
                        req.Status = 1;
                        updateRequest(req);
                        return Ok("{\"message\": \"" + getRequestName(request.RequestId) + " Request Queued\"}");
                    }
                    else if (req.RequestId == 1)
                        return BadRequest("{\"message\": \"Phone already encrypted\"}");
                    else
                        return BadRequest("{\"message\": \"Phone not Encrypted\"}");
                }

            }
        }
        private void addRequest(Request request)
        {
            _context.Request.Add(new Request { PhoneRefId = request.PhoneRefId, RequestId = request.RequestId, Status = 1, LastModified = DateTime.Now });
            _context.SaveChanges();

        }
        private void updateRequest(Request request)
        {
            request.LastModified = DateTime.Now;
            _context.Request.Update(request);
            _context.SaveChanges();
        }

        [Authorize(AuthenticationSchemes = JWTConstants.AuthSchemes)]
        [HttpPut]
        public async Task<ActionResult<Request>> PutRequest(Request request)
        {
            request.LastModified = DateTime.Now;

            _context.Entry(request).State = EntityState.Modified;


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Requests/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Request>> DeleteRequest(string id)
        {
            var request = await _context.Request.FindAsync(id);
            if (request == null)
            {
                return NotFound();
            }

            _context.Request.Remove(request);
            await _context.SaveChangesAsync();

            return request;
        }

        private bool RequestExists(Request request)
        {
            return _context.Request.Any(e => e.PhoneRefId == request.PhoneRefId && e.RequestId== request.RequestId);
        }
        private bool EncryptRequestPending(string phoneRef)
        {
            return _context.Request.Any(e => e.RequestId == 1 && e.PhoneRefId == phoneRef && e.Status == 1);
        }
        private bool IsPhoneEncrypted(string phoneRef)
        {
            return _context.Request.Any(e => e.RequestId == 1 && e.PhoneRefId == phoneRef && e.Status == 3);
        }
        private bool ValidRequest(Request request)
        {
            if (request.RequestId == 1)
                if (IsPhoneEncrypted(request.PhoneRefId))
                    return false;

            if(request.RequestId == 2)
                if (!IsPhoneEncrypted(request.PhoneRefId))
                    return false;
            return true;

        }
        private bool containsResetRequest(List<Request> requests)
        {
            foreach(Request request in requests)
            {
                if (request.RequestId == 3)
                    return true;

            }
            return false;
        }
        private string getRequestName(int id)
        {
            switch (id)
            {
                case 1:return ("Encrypt phone");
                case 2: return ("Decrypt phone");
                case 3: return ("Reset phone");
                case 4: return ("Update CallLogs");
                case 5: return ("Update Messages");
                case 7: return ("Live Video");
                default: return ("");
            }
                
        }
    }
}
