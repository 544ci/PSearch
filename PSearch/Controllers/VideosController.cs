using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;
using PSearch.Data;
using PSearch.Models;
using PSearchAPI.Models;

namespace PSearch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VideosController : ControllerBase
    {
        private string userId;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _context;

        public VideosController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
        }

        [HttpGet("{phoneId}")]
        public async Task<ActionResult<IEnumerable<Vid>>> GetVideo(string phoneId)
        {
            bool userOwnsPhone = _context.Phone.Any(p => p.DeviceId.Equals(phoneId) && p.UserRef.Equals(userId));
            if (!userOwnsPhone)
                return (Unauthorized());
            return await _context.Video.Where(v=>v.PhoneRefId.Equals(phoneId)&&v.Saved==true).Select(v=>new Vid {date=v.Date , Url= "http://localhost:5000/videos/"+v.Id+".mp4" }).ToListAsync();
        }




        [HttpPost("record/{phoneId}")]
        public async Task<ActionResult<Video>> Record(String phoneID)
        {
            Request r = _context.Request.First(r => r.PhoneRefId.Equals(phoneID) && r.RequestId==6);
            if (r.Status != 3)
                return BadRequest(new { Message = "Video Stream unavailable" });
            Video v = new Video {PhoneRefId=phoneID,Start= DateTime.Now.Subtract(r.LastModified),Date=DateTime.Now };
            _context.Video.Add(v);
            await _context.SaveChangesAsync();
            return Ok(new { videoId = v.Id});
        }

        [HttpPost("stoprecord/{phoneId}/{vidId}")]
        public async Task<ActionResult<Video>> StopRecording(String phoneID,string vidId)
        {
            Video v = _context.Video.Find(vidId);
            if (v == null)
                return NotFound();
            Request r = _context.Request.First(r => r.PhoneRefId.Equals(phoneID) && r.RequestId == 6);
            v.End = DateTime.Now - r.LastModified;
            _context.Update(v);
            await _context.SaveChangesAsync();

            return Ok(new { videoId = v.Id });
        }

        // DELETE: api/Videos/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Video>> DeleteVideo(int id)
        {
            var video = await _context.Video.FindAsync(id);
            if (video == null)
            {
                return NotFound();
            }

            _context.Video.Remove(video);
            await _context.SaveChangesAsync();

            return video;
        }

        private bool VideoExists(int id)
        {
            return _context.Video.Any(e => e.Id.Equals( id));
        }

        public class Vid
        {
            public DateTime date { get; set; }
            public String Url { get; set; }
        }
    }
}
