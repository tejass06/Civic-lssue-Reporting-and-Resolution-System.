using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using PragatiSetu.API.Models;
using PragatiSetu.API.Services;
using System.Security.Claims;

namespace PragatiSetu.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // This makes the base path /api/Admin
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly IssuesService _issuesService;

        public AdminController(IssuesService issuesService)
        {
            _issuesService = issuesService;
        }

        private bool IsAdmin()
        {
            var userDepartment = User.FindFirst("department")?.Value;
            return userDepartment != null && userDepartment.Equals("Admin", StringComparison.OrdinalIgnoreCase);
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            if (!IsAdmin()) return Forbid();
            return await _issuesService.GetAllUsersAsync();
        }

        // --- THIS IS THE CORRECTED ENDPOINT ---
        [HttpPost("users")] // This adds "/users" to the base path, creating /api/Admin/users
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto newUserDto)
        {
            if (!IsAdmin()) return Forbid();

            var user = new User
            {
                Username = newUserDto.Username,
                Department = newUserDto.Department
            };

            await _issuesService.CreateUserAsync(user, newUserDto.Password);
            return Ok(user);
        }
    }

    // DTO for creating a new user
    public class CreateUserDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Department { get; set; } = null!;
    }
}