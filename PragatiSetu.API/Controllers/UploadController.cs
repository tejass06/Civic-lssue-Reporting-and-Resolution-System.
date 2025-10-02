using Microsoft.AspNetCore.Mvc;
using PragatiSetu.API.Services;

namespace PragatiSetu.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly ImageUploadService _imageUploadService;

        public UploadController(ImageUploadService imageUploadService) => _imageUploadService = imageUploadService;

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            var imageUrl = await _imageUploadService.UploadImageAsync(file);
            return Ok(new { url = imageUrl });
        }
    }
}