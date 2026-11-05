// public class RegisterVerificationModel
// {
//     public string? FullName { get; set; }
//     public string? Email { get; set; }
//     public string? Password { get; set; }
//     public string? Otp { get; set; }
//     public int? RoleId { get; set; }
// }
using System.ComponentModel.DataAnnotations;

public class RegisterVerificationModel
{
    [Required(ErrorMessage = "Full name is required.")]
    public string? FullName { get; set; }

    [Required(ErrorMessage = "Email address is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    [RegularExpression(@"^[a-zA-Z0-9._%+-]+@up\.edu\.ph$", ErrorMessage = "Must be a valid @up.edu.ph institutional profile.")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Password is required.")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", 
        ErrorMessage = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.")]
    public string? Password { get; set; }

    [Required(ErrorMessage = "Verification OTP is required.")]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP must be exactly 6 digits.")]
    public string? Otp { get; set; }

    [Required(ErrorMessage = "Please select a role.")]
    [Range(1, int.MaxValue, ErrorMessage = "Invalid role selected.")]
    public int? RoleId { get; set; }
}