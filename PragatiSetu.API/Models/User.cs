using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PragatiSetu.API.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!; // In a real app, never store plain text
        public string Department { get; set; } = null!; // e.g., "Road", "Garbage", "Water"
    }

    public class LoginModel
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}