using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    // Not found endpoint - 404
    [HttpGet("not-found")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }

    // Bad request endpoint - 400
    [HttpGet("bad-request")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("Bad request returned.");
    }

    // Unauthorised endpoint - 401
    [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return Unauthorized();
    }

    // Validation error endpoint - still return 400
    // but depend on the validation error that we have
    [HttpGet("validation-error")]
    public IActionResult GetValidationError()
    {
        ModelState.AddModelError("Problem1", "This is the first error.");
        ModelState.AddModelError("Problem2", "This is the second error.");
        return ValidationProblem();
    }

    // Server error endpoint - 500 internal server error
    [HttpGet("server-error")]
    public IActionResult GetServerError()
    {
        throw new Exception("Server error.");
    }
}
