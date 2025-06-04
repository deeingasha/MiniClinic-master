using System.Data;
using Microsoft.AspNetCore.Mvc;
using static MiniClinic.Server.Model.LoginModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Data.SqlClient;
using System.Configuration;
//using Newtonsoft.Json;
using System.Security.Claims;

namespace NeuHMIS.Server.Controllers
   
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        IConfiguration _config;
        public LoginController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("action"), Route("Authentication")]
        public IActionResult Login([FromBody] UserLogin Token)
        {
            string connStr = _config.GetSection("Configuration").GetSection("ConnectionString").Value;
            string username = "";
            string password = "";
            int RoleNo;

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand();
                conn.Open();


                cmd = new SqlCommand("select * from m_User where fn_Role_No=@RoleNo and v_User_Name=@username", conn);
                cmd.Parameters.AddWithValue("@username", Token.Username);
                cmd.Parameters.AddWithValue("@RoleNo", Token.RoleNo);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    username = reader["v_User_Name"].ToString();
                    password = reader["v_Password"].ToString();
                    RoleNo = Convert.ToInt32(reader["fn_Role_No"].ToString());
                }
                reader.Close();
                conn.Close();
            }

            if (username != Token.Username || password != Token.Password)
            {
                return BadRequest(new
                {
                    error = "User not found",
                    message = "The provided credentials do not match any account."
                });
            }

            // Success: Return token
            // Create the JWT token
            string token1 = CreateToken(Token);
            //Token.tokenheader = token1;
            return Ok(new
            {
                token = token1,
                message = "success"
            });


        }




        private string CreateToken(UserLogin user)

        {
            int entityNo = 0;
            string userName = "";
            //string entityType = "";
            string secretWord = "";
            //string email = "";
           // string agentRefCode = "";
            string connStr = _config.GetSection("Configuration").GetSection("ConnectionString").Value;

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand();
                conn.Open();



                //cmd = new SqlCommand("SELECT dbo.m_Entity.pn_Entity_No, dbo.m_Entity.v_Fname + ' ' + dbo.m_Entity.v_Mname + ' ' + dbo.m_Entity.v_Lname AS agentName, " +
                //                    "dbo.m_Entity.fv_Entity_Type, dbo.m_User.v_Secretword, dbo.m_Entity_Address.pv_Address_Type, dbo.m_Entity_Address.v_Address1 " +
                //                    "FROM  dbo.m_Entity INNER JOIN dbo.m_User ON dbo.m_Entity.pn_Entity_No = dbo.m_User.pfn_Entity_No INNER JOIN " +
                //                    "dbo.m_Entity_Address ON dbo.m_User.pfn_Entity_No = dbo.m_Entity_Address.pfn_Entity_No AND " +
                //                    "dbo.m_Entity.pn_Entity_No = dbo.m_Entity_Address.pfn_Entity_No " +
                //                    "WHERE (dbo.m_User.v_User_Name=@username) AND (dbo.m_Entity.fv_Entity_Type = 'AGT') AND(dbo.m_Entity_Address.pv_Address_Type = N'Email')", conn);

                //cmd = new SqlCommand("SELECT dbo.m_Entity.pn_Entity_No, dbo.m_Entity.v_Fname + ' ' + dbo.m_Entity.v_Mname + ' ' + dbo.m_Entity.v_Lname AS agentName, " +
                //                    "dbo.m_Entity.fv_Entity_Type, dbo.m_User.v_Secretword, dbo.m_Entity_Address.pv_Address_Type, dbo.m_Entity_Address.v_Address1 " +
                //                    "FROM  dbo.m_Entity INNER JOIN dbo.m_User ON dbo.m_Entity.pn_Entity_No = dbo.m_User.pfn_Entity_No INNER JOIN " +
                //                    "dbo.m_Entity_Address ON dbo.m_User.pfn_Entity_No = dbo.m_Entity_Address.pfn_Entity_No AND " +
                //                    "dbo.m_Entity.pn_Entity_No = dbo.m_Entity_Address.pfn_Entity_No " +
                //                    "WHERE (dbo.m_User.v_User_Name=@username) AND (dbo.m_Entity.fv_Entity_Type = 'AGT') AND(dbo.m_Entity_Address.pv_Address_Type = N'Email') OR (dbo.m_User.v_User_Name=@username) AND (dbo.m_Entity.fv_Entity_Type = 'BRO') AND(dbo.m_Entity_Address.pv_Address_Type = N'Email')", conn);

                cmd = new SqlCommand("SELECT dbo.m_Entity.pn_Entity_No, dbo.m_Entity.v_Fname + ' ' + dbo.m_Entity.v_Mname + ' ' + dbo.m_Entity.v_Lname AS userName, " +
                                   "dbo.m_Entity.fv_Entity_Type, dbo.m_User.v_Secretword FROM  dbo.m_Entity INNER JOIN dbo.m_User ON " +
                                   "dbo.m_Entity.pn_Entity_No = dbo.m_User.pfn_Entity_No WHERE (dbo.m_User.v_User_Name=@username) AND  (dbo.m_User.v_User_Name=@username)",conn);

               cmd.Parameters.AddWithValue("@username", user.Username);

                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    entityNo = Convert.ToInt32(reader["pn_Entity_No"].ToString());
                    userName = reader["userName"].ToString();
                    //entityType = reader["fv_Entity_Type"].ToString();
                   // email = reader["v_Address1"].ToString();
                    secretWord = reader["v_Secretword"] != DBNull.Value ? reader["v_Secretword"].ToString() : string.Empty;
                    //if (entityType == "AGT")
                    //{
                    //    agentRefCode = "BIAG" + entityNo.ToString();

                    //}
                    //if (entityType == "BRO")
                    //{
                    //    agentRefCode = "BIBR" + entityNo.ToString();

                    //}

                }
                reader.Close();
                conn.Close();

            }




            // Define claims
            var claims = new List<Claim>
        {

            new Claim("name", userName),
            new Claim("entityNumber", entityNo.ToString()),
            
            new Claim("secretword", secretWord)
          //  new Claim("agentRefCode", agentRefCode)

        };




            //var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value!));


            // Get the secret key from configuration

            var tokenKey = _config.GetSection("AppSettings:Token").Value;

            if (string.IsNullOrEmpty(tokenKey))
            {
                throw new InvalidOperationException("AppSettings:Token is not configured.");
            }

            // Generate signing credentials

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(10),
                    signingCredentials: creds
             );
            // Serialize the token to a string
            var tokenHandler = new JwtSecurityTokenHandler();
            string jwt = tokenHandler.WriteToken(token);
            // var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;

        }





        //-----End----
        [HttpPost("UpdatePassword")]
        public IActionResult UpdatePassword([FromBody] UpdatePassword entity1)
        {
            try
            {
                int rowsAffected = 0;
                string connStr = _config.GetSection("Configuration").GetSection("ConnectionString").Value;

                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("UpdatePassword", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@EntityNo", SqlDbType.Int).Value = entity1.EntityNo;
                        cmd.Parameters.Add("@Secretword", SqlDbType.VarChar, 255).Value = entity1.Secretword;
                        cmd.Parameters.Add("@Password", SqlDbType.VarChar, 255).Value = entity1.Password;

                        // Add output parameter
                        SqlParameter outputParam = new SqlParameter("@RowsAffected", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        cmd.ExecuteNonQuery();

                        // Get the value from the output parameter
                        rowsAffected = (int)cmd.Parameters["@RowsAffected"].Value;

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Password updated successfully" });
                        }
                        else
                        {
                            return BadRequest(new { message = "No matching record found, or update failed" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Data saving failed", error = ex.Message });
            }
        }






    }
}
