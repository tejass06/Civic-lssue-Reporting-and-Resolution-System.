using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace PragatiSetu.API.Services
{
    public class ImageUploadService
    {
        private readonly Cloudinary _cloudinary;

        public ImageUploadService(IOptions<CloudinarySettings> config)
        {
            var account = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams { File = new FileDescription(file.FileName, stream) };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }
            return uploadResult.SecureUrl?.ToString() ?? string.Empty;
        }
    }
}