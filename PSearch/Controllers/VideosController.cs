using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;
using PSearch.Data;
using PSearch.Models;

namespace PSearch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VideosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Videos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Video>>> GetVideo()
        {
            return await _context.Video.ToListAsync();
        }




        [HttpPost("record/{phoneId}")]
        public async Task<ActionResult<Video>> Record(String phoneID)
        {
            Request r = _context.Request.First(r => r.PhoneRefId.Equals(phoneID) && r.RequestId==6);
            if (r.Status != 3)
                return BadRequest(new { Message = "Video Stream unavailable" });
            Video v = new Video {PhoneRefId=phoneID,Start= DateTime.Now.Subtract(r.LastModified),Date=DateTime.Now };
            _context.Add(v);
            _context.SaveChanges();
            return Ok(new { videoId = v.Id});
        }

        [HttpPost("stoprecord/{phoneId}/{vidId}")]
        public async Task<ActionResult<Video>> StopRecording(String phoneID,int vidId)
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
            return _context.Video.Any(e => e.Id == id);
        }
    }
}
