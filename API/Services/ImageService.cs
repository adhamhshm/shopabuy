using System;
using API.RequestHelpers;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

// This service handles image upload and deletion using Cloudinary.
public class ImageService
{
    // Cloudinary instance used to perform upload and deletion operations.
    private readonly Cloudinary _cloudinary;

    // Constructor initializes the Cloudinary account using environment variables.
    public ImageService()
    {
        // Create a new Cloudinary account using credentials from environment variables.
        // The order of parameters must be: cloud name, API key, API secret.
        var acc = new Account(
            Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME"),
            Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY"),
            Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET")
        );

        // Instantiate the Cloudinary object with the given account.
        _cloudinary = new Cloudinary(acc);
    }

    // Uploads an image file to Cloudinary and returns the result.
    public async Task<ImageUploadResult> AddImageAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();

        // Ensure the file is not empty.
        if (file.Length > 0)
        {
            // Open the file stream for reading.
            using var stream = file.OpenReadStream();

            // Define the parameters for uploading the image.
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "shopabuy" // Upload to the 'rs-course' folder in Cloudinary.
            };

            // Perform the asynchronous upload.
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        // Return the result of the upload (success or error info).
        return uploadResult;
    }

    // Deletes an image from Cloudinary using its public ID.
    public async Task<DeletionResult> DeleteImageAsync(string publicId)
    {
        // Set up the deletion parameters with the given public ID.
        var deleteParams = new DeletionParams(publicId);

        // Perform the asynchronous deletion.
        var result = await _cloudinary.DestroyAsync(deleteParams);

        // Return the result of the deletion (success or error info).
        return result;
    }
}


// with IOptions
// public ImageService(IOptions<CloudinarySettings> config)
// {
//     var acc = new Account(
//         config.Value.CloudName,
//         config.Value.ApiKey,
//         config.Value.ApiSecret
//     );

//     _cloudinary = new Cloudinary(acc);
// }