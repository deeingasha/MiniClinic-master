using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MiniClinic.Server.Models;
using System.Data;

namespace MiniClinic.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntityController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly string _connStr;

        public EntityController(IConfiguration config)
        {
            _config = config;
            _connStr = _config.GetSection("Configuration:ConnectionString").Value ?? string.Empty;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEntities([FromQuery] EntityFilter filter)
        {
            if (filter == null)
            {
                filter = new EntityFilter();
            }

            try
            {
                using var conn = new SqlConnection(_connStr);
                await conn.OpenAsync();

                var query = @"
                    WITH FilteredEntities AS (
                        SELECT 
                            e.*,
                            ROW_NUMBER() OVER (ORDER BY e.pn_Entity_No DESC) AS RowNum,
                            COUNT(*) OVER () AS TotalCount
                        FROM 
                            m_Entity e
                        WHERE 
                            1=1";

                // Add search conditions
                if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
                {
                    query += @" AND (
                        e.v_Fname LIKE '%' + @SearchTerm + '%' OR
                        e.v_Mname LIKE '%' + @SearchTerm + '%' OR
                        e.v_Lname LIKE '%' + @SearchTerm + '%' OR
                        e.v_Patient_No LIKE '%' + @SearchTerm + '%' OR
                        e.v_Id_No LIKE '%' + @SearchTerm + '%'
                    )";
                }

                // Add entity type filter
                if (!string.IsNullOrWhiteSpace(filter.EntityTypeCode))
                {
                    query += " AND e.fv_Entity_Type_Code = @EntityTypeCode";
                }

                query += @"
                    )
                    SELECT * FROM FilteredEntities
                    WHERE RowNum BETWEEN (@PageNumber - 1) * @PageSize + 1 AND @PageNumber * @PageSize
                    ORDER BY RowNum";

                using var cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@PageNumber", filter.PageNumber);
                cmd.Parameters.AddWithValue("@PageSize", filter.PageSize);

                if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
                {
                    cmd.Parameters.AddWithValue("@SearchTerm", filter.SearchTerm);
                }

                if (!string.IsNullOrWhiteSpace(filter.EntityTypeCode))
                {
                    cmd.Parameters.AddWithValue("@EntityTypeCode", filter.EntityTypeCode);
                }

                var result = new PagedResult<EntityViewModel>
                {
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageSize,
                    Items = new List<EntityViewModel>()
                };

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var entity = MapEntityFromReader(reader);
                    result.Items.Add(entity);

                    // Get total count from the first row
                    if (result.TotalCount == 0 && !reader.IsDBNull(reader.GetOrdinal("TotalCount")))
                    {
                        result.TotalCount = Convert.ToInt32(reader["TotalCount"]);
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", message = ex.Message });
            }
        }

        [HttpGet("{entityNo}")]
        public async Task<IActionResult> GetEntity(int entityNo)
        {
            if (entityNo <= 0)
            {
                return BadRequest(new { error = "Invalid request", message = "Entity number must be greater than zero" });
            }

            try
            {
                using var conn = new SqlConnection(_connStr);
                await conn.OpenAsync();

                using var cmd = new SqlCommand("SELECT * FROM m_Entity WHERE pn_Entity_No = @EntityNo", conn);
                cmd.Parameters.AddWithValue("@EntityNo", entityNo);

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    var entity = MapEntityFromReader(reader);
                    return Ok(entity);
                }
                else
                {
                    return NotFound(new { error = "Entity not found", message = "No entity found with that number" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateEntity([FromBody] CreateEntityModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                using var conn = new SqlConnection(_connStr);
                await conn.OpenAsync();

                // Get next entity number
                int entityNo = await GetNextEntityNo(conn);

                // Call SaveEntity stored procedure
                using var cmd = new SqlCommand("SaveEntity", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                // Add parameters
                AddSaveEntityParameters(cmd, entityNo, model);

                await cmd.ExecuteNonQueryAsync();

                return CreatedAtAction(nameof(GetEntity), new { entityNo }, new { entityNo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", message = ex.Message });
            }
        }

        [HttpPut("{entityNo}")]
        public async Task<IActionResult> UpdateEntity(int entityNo, [FromBody] UpdateEntityModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (entityNo <= 0)
            {
                return BadRequest(new { error = "Invalid request", message = "Entity number must be greater than zero" });
            }

            model.EntityNo = entityNo;

            try
            {
                using var conn = new SqlConnection(_connStr);
                await conn.OpenAsync();

                // Check if entity exists
                bool entityExists = await EntityExists(conn, entityNo);
                if (!entityExists)
                {
                    return NotFound(new { error = "Entity not found", message = "No entity found with that number" });
                }

                // Call SaveEntity stored procedure
                using var cmd = new SqlCommand("SaveEntity", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                // Add parameters
                AddSaveEntityParameters(cmd, entityNo, model);

                await cmd.ExecuteNonQueryAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", message = ex.Message });
            }
        }

        [HttpDelete("{entityNo}")]
        public async Task<IActionResult> DeleteEntity(int entityNo)
        {
            if (entityNo <= 0)
            {
                return BadRequest(new { error = "Invalid request", message = "Entity number must be greater than zero" });
            }

            try
            {
                using var conn = new SqlConnection(_connStr);
                await conn.OpenAsync();

                // Check if entity exists
                bool entityExists = await EntityExists(conn, entityNo);
                if (!entityExists)
                {
                    return NotFound(new { error = "Entity not found", message = "No entity found with that number" });
                }

                // Soft delete by updating status
                using var cmd = new SqlCommand("UPDATE m_Entity SET v_Status = 0 WHERE pn_Entity_No = @EntityNo", conn);
                cmd.Parameters.AddWithValue("@EntityNo", entityNo);

                await cmd.ExecuteNonQueryAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", message = ex.Message });
            }
        }

        #region Helper Methods

        private async Task<int> GetNextEntityNo(SqlConnection conn)
        {
            using var cmd = new SqlCommand("SELECT ISNULL(MAX(pn_Entity_No), 0) + 1 FROM m_Entity", conn);
            return Convert.ToInt32(await cmd.ExecuteScalarAsync());
        }

        private async Task<bool> EntityExists(SqlConnection conn, int entityNo)
        {
            using var cmd = new SqlCommand("SELECT 1 FROM m_Entity WHERE pn_Entity_No = @EntityNo", conn);
            cmd.Parameters.AddWithValue("@EntityNo", entityNo);
            return await cmd.ExecuteScalarAsync() != null;
        }

        private void AddSaveEntityParameters(SqlCommand cmd, int entityNo, object model)
        {
            cmd.Parameters.AddWithValue("@EntityNo", entityNo);

            if (model is CreateEntityModel createModel)
            {
                cmd.Parameters.AddWithValue("@PatientNo", createModel.PatientNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Fname", createModel.FName ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Mname", createModel.MName ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Lname", createModel.LName ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DOB", createModel.DOB ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Sex", createModel.Sex ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EntityTypeCode", createModel.EntityTypeCode);
                cmd.Parameters.AddWithValue("@IdType", createModel.IdType ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdNo", createModel.IdNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@MaritalStatus", createModel.MaritalStatus ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Nationality", createModel.Nationality ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Disability", createModel.Disability ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Remark", createModel.Remark ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@StatusDate", createModel.StatusDate ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Designation", createModel.Designation ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Qualification", createModel.Qualification ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Status", createModel.Status ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Dor", createModel.Dor ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@PatInsured", createModel.PatInsured ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CountryNo", createModel.CountryNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Title", createModel.Title ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FileNo", createModel.FileNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DepartmentNo", createModel.DepartmentNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CompanyNo", createModel.CompanyNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@BranchNo", createModel.BranchNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EmployeePinNo", createModel.EmployeePinNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@BankAccountNo", createModel.BankAccountNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NSSFNo", createModel.NSSFNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NHIFNo", createModel.NHIFNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EmploymentTypeNo", createModel.EmploymentTypeNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Age", createModel.Age ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Regby", createModel.Regby ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NextKin", createModel.NextKin ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NextKinMobile", createModel.NextKinMobile ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NextKinRelationship", createModel.NextKinRelationship ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@RegisteredBy", createModel.RegisteredBy ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ModifiedBy", createModel.ModifiedBy ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ModifiedDate", createModel.ModifiedDate ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@PatientPayType", createModel.PatientPayType ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Father", createModel.Father ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Mother", createModel.Mother ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@StaffNo", createModel.StaffNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@BankNo", createModel.BankNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@BankBranchNo", createModel.BankBranchNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@MpesaMobileNo", createModel.MpesaMobileNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@SalaryPaymentMode", createModel.SalaryPaymentMode ?? (object)DBNull.Value);
            }
            else if (model is UpdateEntityModel updateModel)
            {
                cmd.Parameters.AddWithValue("@PatientNo", updateModel.PatientNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Fname", updateModel.FName ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Mname", updateModel.MName ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Lname", updateModel.LName ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DOB", updateModel.DOB ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Sex", updateModel.Sex ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EntityTypeCode", updateModel.EntityTypeCode);
                cmd.Parameters.AddWithValue("@IdType", updateModel.IdType ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdNo", updateModel.IdNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@MaritalStatus", updateModel.MaritalStatus ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Nationality", updateModel.Nationality ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Disability", updateModel.Disability ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Remark", updateModel.Remark ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@StatusDate", updateModel.StatusDate ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Designation", updateModel.Designation ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Qualification", updateModel.Qualification ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Status", updateModel.Status ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Dor", updateModel.Dor ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@PatInsured", updateModel.PatInsured ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CountryNo", updateModel.CountryNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Title", updateModel.Title ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FileNo", updateModel.FileNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DepartmentNo", updateModel.DepartmentNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CompanyNo", updateModel.CompanyNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@BranchNo", updateModel.BranchNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EmployeePinNo", updateModel.EmployeePinNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@BankAccountNo", updateModel.BankAccountNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NSSFNo", updateModel.NSSFNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NHIFNo", updateModel.NHIFNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EmploymentTypeNo", updateModel.EmploymentTypeNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Age", updateModel.Age ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Regby", updateModel.Regby ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NextKin", updateModel.NextKin ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NextKinMobile", updateModel.NextKinMobile ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NextKinRelationship", updateModel.NextKinRelationship ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@RegisteredBy", updateModel.RegisteredBy ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ModifiedBy", updateModel.ModifiedBy ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ModifiedDate", updateModel.ModifiedDate ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@PatientPayType", updateModel.PatientPayType ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Father", updateModel.Father ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Mother", updateModel.Mother ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@StaffNo", updateModel.StaffNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@BankNo", updateModel.BankNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@BankBranchNo", updateModel.BankBranchNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@MpesaMobileNo", updateModel.MpesaMobileNo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@SalaryPaymentMode", updateModel.SalaryPaymentMode ?? (object)DBNull.Value);
            }
        }

        private EntityViewModel MapEntityFromReader(SqlDataReader reader)
        {
            return new EntityViewModel
            {
                EntityNo = Convert.ToInt32(reader["pn_Entity_No"]),
                PatientNo = reader["v_Patient_No"] == DBNull.Value ? null : reader["v_Patient_No"].ToString(),
                FName = reader["v_Fname"] == DBNull.Value ? null : reader["v_Fname"].ToString(),
                MName = reader["v_Mname"] == DBNull.Value ? null : reader["v_Mname"].ToString(),
                LName = reader["v_Lname"] == DBNull.Value ? null : reader["v_Lname"].ToString(),
                DOB = reader["d_DOB"] == DBNull.Value ? null : Convert.ToDateTime(reader["d_DOB"]),
                Sex = reader["v_Sex"] == DBNull.Value ? null : reader["v_Sex"].ToString(),
                EntityTypeCode = reader["fv_Entity_Type_Code"] == DBNull.Value ? null : reader["fv_Entity_Type_Code"].ToString(),
                IdType = reader["v_Id_Type"] == DBNull.Value ? null : reader["v_Id_Type"].ToString(),
                IdNo = reader["v_Id_No"] == DBNull.Value ? null : reader["v_Id_No"].ToString(),
                MaritalStatus = reader["v_Marital_Status"] == DBNull.Value ? null : reader["v_Marital_Status"].ToString(),
                Nationality = reader["v_Nationality"] == DBNull.Value ? null : reader["v_Nationality"].ToString(),
                Disability = reader["v_Disability"] == DBNull.Value ? null : reader["v_Disability"].ToString(),
                Remark = reader["v_Remark"] == DBNull.Value ? null : reader["v_Remark"].ToString(),
                StatusDate = reader["d_Status_Date"] == DBNull.Value ? null : Convert.ToDateTime(reader["d_Status_Date"]),
                Designation = reader["v_Designation"] == DBNull.Value ? null : reader["v_Designation"].ToString(),
                Qualification = reader["v_Qualification"] == DBNull.Value ? null : reader["v_Qualification"].ToString(),
                Status = reader["v_Status"] == DBNull.Value ? null : Convert.ToBoolean(reader["v_Status"]),
                Dor = reader["d_Dor"] == DBNull.Value ? null : Convert.ToDateTime(reader["d_Dor"]),
                PatInsured = reader["b_Pat_Insured"] == DBNull.Value ? null : Convert.ToBoolean(reader["b_Pat_Insured"]),
                CountryNo = reader["fn_Country_No"] == DBNull.Value ? null : Convert.ToInt32(reader["fn_Country_No"]),
                Title = reader["v_Title"] == DBNull.Value ? null : reader["v_Title"].ToString(),
                FileNo = reader["v_File_No"] == DBNull.Value ? null : reader["v_File_No"].ToString(),
                DepartmentNo = reader["fn_Department_No"] == DBNull.Value ? null : Convert.ToInt32(reader["fn_Department_No"]),
                CompanyNo = reader["fn_Company_No"] == DBNull.Value ? null : Convert.ToInt32(reader["fn_Company_No"]),
                BranchNo = reader["fn_Branch_No"] == DBNull.Value ? null : Convert.ToInt32(reader["fn_Branch_No"]),
                EmployeePinNo = reader["v_Employee_Pin_No"] == DBNull.Value ? null : reader["v_Employee_Pin_No"].ToString(),
                BankAccountNo = reader["v_Bank_Account_No"] == DBNull.Value ? null : reader["v_Bank_Account_No"].ToString(),
                NSSFNo = reader["n_NSSF_No"] == DBNull.Value ? null : reader["n_NSSF_No"].ToString(),
                NHIFNo = reader["n_NHIF_No"] == DBNull.Value ? null : reader["n_NHIF_No"].ToString(),
                EmploymentTypeNo = reader["fn_Employment_Type_No"] == DBNull.Value ? null : Convert.ToInt32(reader["fn_Employment_Type_No"]),
                Age = reader["n_Age"] == DBNull.Value ? null : Convert.ToInt32(reader["n_Age"]),
                Regby = reader["v_Reg_by"] == DBNull.Value ? null : reader["v_Reg_by"].ToString(),
                NextKin = reader["v_Next_Kin"] == DBNull.Value ? null : reader["v_Next_Kin"].ToString(),
                NextKinMobile = reader["v_Next_Kin_Mobile"] == DBNull.Value ? null : reader["v_Next_Kin_Mobile"].ToString(),
                NextKinRelationship = reader["v_Next_Kin_Relationship"] == DBNull.Value ? null : reader["v_Next_Kin_Relationship"].ToString(),
                RegisteredBy = reader["n_Registered_By"] == DBNull.Value ? null : Convert.ToInt32(reader["n_Registered_By"]),
                ModifiedBy = reader["n_Modified_By"] == DBNull.Value ? null : Convert.ToInt32(reader["n_Modified_By"]),
                ModifiedDate = reader["d_Modified_Date"] == DBNull.Value ? null : Convert.ToDateTime(reader["d_Modified_Date"]),
                PatientPayType = reader["v_Patient_Pay_Type"] == DBNull.Value ? null : reader["v_Patient_Pay_Type"].ToString(),
                Father = reader["v_Father"] == DBNull.Value ? null : reader["v_Father"].ToString(),
                Mother = reader["v_Mother"] == DBNull.Value ? null : reader["v_Mother"].ToString(),
                StaffNo = reader["v_Staff_No"] == DBNull.Value ? null : reader["v_Staff_No"].ToString(),
                BankNo = reader["fn_Bank_No"] == DBNull.Value ? null : Convert.ToInt32(reader["fn_Bank_No"]),
                BankBranchNo = reader["fn_Bank_Branch_No"] == DBNull.Value ? null : Convert.ToInt32(reader["fn_Bank_Branch_No"]),
                MpesaMobileNo = reader["n_Mpesa_Mobile_No"] == DBNull.Value ? null : Convert.ToInt32(reader["n_Mpesa_Mobile_No"]),
                SalaryPaymentMode = reader["v_Salary_Payment_Mode"] == DBNull.Value ? null : reader["v_Salary_Payment_Mode"].ToString()
            };
        }

        #endregion
    }
}
