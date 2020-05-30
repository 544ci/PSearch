using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
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
    public class ImageController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private static IWebHostEnvironment _environment;
        private readonly ApplicationDbContext _context;
        public ImageController(IWebHostEnvironment environment, ApplicationDbContext context,
             IHttpContextAccessor httpContextAccessor)
        {
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        public class ImageFiles
        {
            [Required]
            public IFormFile files { get; set; }
            [Required]
            public string phoneId { get; set; }
        }
        [Authorize(AuthenticationSchemes = JWTConstants.AuthSchemes)]
        [HttpPost]
        public IActionResult PostImage([FromForm] ImageFiles images)
        {
            try
            {
                if (images.files.Length > 0)
                {
                    if (!Directory.Exists(_environment.WebRootPath + "\\Images\\"))
                    {
                        Directory.CreateDirectory(_environment.WebRootPath + "\\Images\\");
                    }
                    string newFileName = Guid.NewGuid().ToString() + images.files.FileName;
                    FileStream fileStream = System.IO.File.Create(_environment.WebRootPath + "\\Images\\" + newFileName);
                    images.files.CopyTo(fileStream);
                    fileStream.Flush();
                    fileStream.Close();

                    Image img = new Image();
                    img.ImageName = newFileName;
                    img.PhoneRefId = images.phoneId;
                    img.Date = DateTime.Now;
                    _context.Add(img);
                    try
                    {
                         _context.SaveChanges();
                    }
                    catch (DbUpdateException)
                    {
                        return BadRequest();
                    }

                    return Ok("\\Images\\" + newFileName);
                }
                else
                {
                    return BadRequest("Upload one file at a time");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ToString());
            }
        }
        [Authorize]
        [HttpGet("{id}")]
        public  ActionResult<List<Image>> GetImage(string id)
        {
            String UserId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            //List<Phone> UserPhones = _context.Phones.Where(e => e.UserRef == UserId).ToList();
            Phone[] phones = _context.Phone.Where(e=>e.UserRef == UserId).ToArray();

            foreach (Phone p in phones)
            {
                if (p.DeviceId.Equals(id))
                {
                    //return _context.Images.Where(e => e.PhoneRefId == id).ToList();
                    return _context.Image.Where(e => e.PhoneRefId == id).ToList();

                }
            }
            return NotFound();
        }

    }


}