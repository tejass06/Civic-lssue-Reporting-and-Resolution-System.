using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using PragatiSetu.API.Models; // Make sure your models are in this namespace
using PragatiSetu.API.Services; // Make sure your service is in this namespace

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IssuesService _service; // Inject the IssuesService

    // Updated constructor to get both IConfiguration and IssuesService
    public AuthController(IConfiguration config, IssuesService service)
    {
        _config = config;
        _service = service;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        // Find the user in the database
        var user = await _service.GetUserAsync(request.Username);

        // Check if the user exists and if the password is correct (using a dummy password for the prototype)
        if (user != null && request.Password == "admin")
        {
            var tokenString = GenerateJwtToken(user);
            return Ok(new { token = tokenString });
        }

        return Unauthorized();
    }

    // Updated to accept the full User object to get the department
    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim("department", user.Department), // IMPORTANT: Adds the department to the token
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(8), // Token is valid for 8 hours
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// Your DTO class remains the same
public class LoginRequestDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}