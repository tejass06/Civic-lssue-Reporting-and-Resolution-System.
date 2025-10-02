using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using PragatiSetu.API.Models;
using PragatiSetu.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PragatiSetu.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class IssuesController : ControllerBase
    {
        private readonly IssuesService _issuesService;

        public IssuesController(IssuesService issuesService) => _issuesService = issuesService;

        

        [HttpGet("public")]
        [AllowAnonymous] 
        public async Task<List<Issue>> GetPublicIssues()
        {
            return await _issuesService.GetAsync();
        }

        [HttpPost]
        [AllowAnonymous] 
        public async Task<IActionResult> Post(Issue newIssue)
        {
            await _issuesService.CreateAsync(newIssue);
            return CreatedAtAction(nameof(Get), new { id = newIssue.Id }, newIssue);
        }

       
        [HttpGet]
        public async Task<List<Issue>> Get()
        {
            var userDepartment = User.FindFirst("department")?.Value;
            if (string.IsNullOrEmpty(userDepartment)) return new List<Issue>();

            var issueTypesForDepartment = new List<string>();
            if (userDepartment.Equals("Road", StringComparison.OrdinalIgnoreCase)) issueTypesForDepartment.Add("Pothole");
            if (userDepartment.Equals("Garbage", StringComparison.OrdinalIgnoreCase)) issueTypesForDepartment.Add("Garbage Overflow");
            if (userDepartment.Equals("Water", StringComparison.OrdinalIgnoreCase)) issueTypesForDepartment.Add("Water Leakage");
            if (userDepartment.Equals("Electricity", StringComparison.OrdinalIgnoreCase)) issueTypesForDepartment.Add("Broken Streetlight");

            if (issueTypesForDepartment.Any())
            {
                return await _issuesService.GetByTypesAsync(issueTypesForDepartment);
            }

            if (userDepartment.Equals("Admin", StringComparison.OrdinalIgnoreCase))
            {
                return await _issuesService.GetAsync();
            }

            return new List<Issue>();
        }

        [HttpGet("stats")]
        public async Task<ActionResult<IssueStats>> GetStats()
        {
            var userDepartment = User.FindFirst("department")?.Value;
            if (string.IsNullOrEmpty(userDepartment)) return Unauthorized();

            var issueTypesForDepartment = new List<string>();
            if (userDepartment.Equals("Road", StringComparison.OrdinalIgnoreCase)) issueTypesForDepartment.Add("Pothole");
            if (userDepartment.Equals("Garbage", StringComparison.OrdinalIgnoreCase)) issueTypesForDepartment.Add("Garbage Overflow");
            if (userDepartment.Equals("Water", StringComparison.OrdinalIgnoreCase)) issueTypesForDepartment.Add("Water Leakage");

            var stats = await _issuesService.GetStatsAsync(
                userDepartment.Equals("Admin", StringComparison.OrdinalIgnoreCase) ? null : issueTypesForDepartment
            );
            return Ok(stats);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] StatusUpdateDto statusUpdate)
        {
            var issue = await _issuesService.GetAsync(id);
            if (issue is null) return NotFound();

            issue.Status = statusUpdate.Status;

            if (new List<string> { "solved", "resolved", "completed" }.Contains(statusUpdate.Status.ToLower()))
            {
                issue.ResolvedAt = DateTime.UtcNow;
            }

            await _issuesService.UpdateAsync(id, issue);
            return NoContent();
        }

        [HttpPut("{id}/assign")]
        public async Task<IActionResult> AssignWorker(string id, [FromBody] AssignWorkerDto assignWorkerDto)
        {
            var issue = await _issuesService.GetAsync(id);
            if (issue is null) return NotFound();

            issue.AssignedTo = assignWorkerDto.WorkerName;
            issue.Status = "In Progress";

            await _issuesService.UpdateAsync(id, issue);
            return NoContent();
        }
    }

    public class StatusUpdateDto
    {
        public string Status { get; set; } = null!;
    }

    public class AssignWorkerDto
    {
        public string WorkerName { get; set; } = null!;
    }
}