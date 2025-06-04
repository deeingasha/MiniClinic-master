namespace MiniClinic.Server.Models
{
    public class LoginModel
    {
        public class UserLogin
        {
            public required string Username { get; set; }
            public required string Password { get; set; }
            public string? tokenheader { get; set; }
            public int RoleNo { get; set; }

        }

        public class UpdatePassword
        {
            public required string EntityNo { get; set; }
            public required string Secretword { get; set; }
            public required string Password { get; set; }


        }
    }
}
