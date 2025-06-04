namespace MiniClinic.Server.Model
{
    public class LoginModel
    {
        public class UserLogin
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string tokenheader { get; set; }
            public int RoleNo { get; set; }

        }

        public class UpdatePassword
        {
            public string EntityNo { get; set; }
            public string Secretword { get; set; }
            public string Password { get; set; }


        }
    }
}
