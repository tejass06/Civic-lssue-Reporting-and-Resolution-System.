using BCrypt.Net;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using PragatiSetu.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static PragatiSetu.API.Models.Issue;

namespace PragatiSetu.API.Services
{
    public class IssuesService
    {
        private readonly IMongoCollection<Issue> _issuesCollection;
        private readonly IMongoCollection<User> _usersCollection;

        public IssuesService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _issuesCollection = database.GetCollection<Issue>(settings.Value.IssuesCollectionName);
            _usersCollection = database.GetCollection<User>("Users");
        }

        // --- Issue Methods ---

        public async Task<List<Issue>> GetAsync() =>
            await _issuesCollection.Find(_ => true).SortByDescending(i => i.CreatedAt).ToListAsync();

        public async Task<Issue?> GetAsync(string id) =>
            await _issuesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<List<Issue>> GetByTypesAsync(List<string> types)
        {
            var pattern = string.Join("|", types.Select(Regex.Escape));
            var regexFilter = new BsonRegularExpression($"^({pattern})$", "i");
            var filter = Builders<Issue>.Filter.Regex(issue => issue.Type, regexFilter);
            return await _issuesCollection.Find(filter).SortByDescending(i => i.CreatedAt).ToListAsync();
        }

        public async Task CreateAsync(Issue newIssue) =>
            await _issuesCollection.InsertOneAsync(newIssue);

        public async Task UpdateAsync(string id, Issue updatedIssue) =>
            await _issuesCollection.ReplaceOneAsync(x => x.Id == id, updatedIssue);

        // --- User Methods ---

        public async Task<User?> GetUserAsync(string username) =>
            await _usersCollection.Find(u => u.Username == username).FirstOrDefaultAsync();

        public async Task<List<User>> GetAllUsersAsync() =>
            await _usersCollection.Find(_ => true).ToListAsync();

        public async Task<User> CreateUserAsync(User newUser, string password)
        {
            newUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            await _usersCollection.InsertOneAsync(newUser);
            return newUser;
        }

        public async Task<bool> ResetUserPasswordAsync(string userId, string newPassword)
        {
            var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null) return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            var result = await _usersCollection.ReplaceOneAsync(u => u.Id == userId, user);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        // --- Analytics Methods ---

        public async Task<IssueStats> GetStatsAsync(List<string>? issueTypes = null)
        {
            var filter = Builders<Issue>.Filter.Empty;
            if (issueTypes != null && issueTypes.Any())
            {
                var pattern = string.Join("|", issueTypes.Select(Regex.Escape));
                var regex = new BsonRegularExpression($"^({pattern})$", "i");
                filter = Builders<Issue>.Filter.Regex(issue => issue.Type, regex);
            }

            var solvedStatusStrings = new List<string> { "solved", "resolved", "completed" };
            var pendingStatusStrings = new List<string> { "pending", "in progress" };

            var solvedRegex = new BsonRegularExpression(string.Join("|", solvedStatusStrings), "i");
            var pendingRegex = new BsonRegularExpression(string.Join("|", pendingStatusStrings), "i");

            var solvedStatusFilter = filter & Builders<Issue>.Filter.Regex(issue => issue.Status, solvedRegex);
            var pendingStatusFilter = filter & Builders<Issue>.Filter.Regex(issue => issue.Status, pendingRegex);

            var totalIssuesTask = _issuesCollection.CountDocumentsAsync(filter);
            var solvedIssuesTask = _issuesCollection.CountDocumentsAsync(solvedStatusFilter);
            var pendingIssuesTask = _issuesCollection.CountDocumentsAsync(pendingStatusFilter);

            await Task.WhenAll(totalIssuesTask, solvedIssuesTask, pendingIssuesTask);

            return new IssueStats
            {
                TotalIssues = await totalIssuesTask,
                SolvedIssues = await solvedIssuesTask,
                PendingIssues = await pendingIssuesTask
            };
        }

        public async Task<object> GetIssuesByDepartmentStatsAsync()
        {
            var stats = await _issuesCollection.Aggregate()
                .Group(
                    issue => issue.Type,
                    group => new {
                        Department = group.Key,
                        Total = group.Sum(x => 1),
                        Solved = group.Sum(x =>
                            (new List<string> { "solved", "resolved", "completed" }).Contains(x.Status.ToLower()) ? 1 : 0
                        )
                    }
                ).ToListAsync();
            return stats;
        }

        public async Task<List<HeatmapData>> GetHeatmapDataAsync()
        {
            return await _issuesCollection.Find(_ => true)
                .Project(issue => new HeatmapData
                { // We now create a proper HeatmapData object
                    lat = issue.Latitude,
                    lng = issue.Longitude,
                    intensity = 1.0
                }).ToListAsync();
        }
    }
}