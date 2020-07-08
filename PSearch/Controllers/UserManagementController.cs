using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using IdentityModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PSearch.Data;
using PSearch.Models;
using PSearchAPI.Models;

namespace PSearch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserManagementController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _context;
        public UserManagementController(ApplicationDbContext context, SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            this._signInManager = signInManager;
            this._userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _context = context;

        }

        [HttpPost("register")]
        public async Task<IActionResult> register([FromBody]userManagement user)
        {
            if(user.Email==null || user.Password==null)
                return BadRequest();
            var usr = new ApplicationUser { UserName = user.Email, Email = user.Email, EmailConfirmed = true};
            var result = await _userManager.CreateAsync(usr, user.Password);
            if(!result.Succeeded)
                return BadRequest();

            return Ok();
        }
        [HttpPost("signin")]
        public async Task<IActionResult> login([FromBody]userManagement user)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            if (user.DeviceId == null || user.Model == null || user.Manufacturer == null)
                return BadRequest();
            var u = await _userManager.FindByEmailAsync(user.Email);
            var signInResult = await _signInManager.CheckPasswordSignInAsync(u, user.Password, false);
            if (!signInResult.Succeeded)
                return BadRequest();
            if (phoneInUse(user.DeviceId))
                if (!userOwnsPhone(u.Id, user.DeviceId))
                    return Unauthorized();
            

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWTConstants.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {                
                new Claim(JwtRegisteredClaimNames.Sub,user.Email),
                new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Email)
            };
            var token = new JwtSecurityToken(JWTConstants.Issuer, JWTConstants.Audience,claims,expires:DateTime.UtcNow.AddDays(1000),signingCredentials: creds);
            
            var result = new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            };
            var usr = await _userManager.FindByEmailAsync(user.Email);
            
            var phone = new Phone() { DeviceId=user.DeviceId ,Model=user.Model,Manufacturer=user.Manufacturer,UserRef=usr.Id, EncryptionKey=getKey() };
            try
            {
                _context.Add(phone);
                _context.SaveChanges();
            }
            catch(DbUpdateException ex)
            {
                
            }
            return Created("", result); 
        }
        [HttpGet("getEncryptionKey/{id}")]
        [Authorize(AuthenticationSchemes = JWTConstants.AuthSchemes)]
        public  IActionResult getEncryptionKey(string id)
        {
            String userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            String usrId = _context.Users.First(e => e.Email == userId).Id;
            if (userOwnsPhone(usrId,id))
            {
                string encryptionKey = _context.Phone.First(p => p.DeviceId.Equals(id)).EncryptionKey;
                return Ok(new { encryptionKey });
            }
            else
                return Unauthorized();
        }

        private String getKey()
        {
            var random = new Random();
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            char[] key = new char[32];
            for (int i = 0; i < 32; i++)
            {
                key[i] = chars[random.Next(0,chars.Length)];
            }
            return new string(key);
        }
        private bool userOwnsPhone(string userId, string phoneId)
        {
           return _context.Phone.Any(p => p.UserRef.Equals(userId) && p.DeviceId.Equals(phoneId));
        }
        private bool phoneInUse(string phoneId)
        {
            return _context.Phone.Any(p=> p.DeviceId.Equals(phoneId));
        }
    }
}