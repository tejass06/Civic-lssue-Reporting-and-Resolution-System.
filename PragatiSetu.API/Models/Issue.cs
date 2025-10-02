using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PragatiSetu.API.Models
{
    public class Issue
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Type { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
        public string Status { get; set; } = "Pending";
        public string? AssignedTo { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public class HeatmapData
        {
            public double lat { get; set; }
            public double lng { get; set; }
            public double intensity { get; set; }
        }
    }
}
public class StatusUpdateDto
    {
        public string Status { get; set; } = null!;
    }
