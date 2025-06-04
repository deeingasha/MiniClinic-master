namespace MiniClinic.Server.Models
{
    public class CreateEntityModel
    {
        public string? PatientNo { get; set; }
        public string? FName { get; set; }
        public string? MName { get; set; }
        public string? LName { get; set; }
        public DateTime? DOB { get; set; }
        public string? Sex { get; set; }
        public required string EntityTypeCode { get; set; }
        public string? IdType { get; set; }
        public string? IdNo { get; set; }
        public string? MaritalStatus { get; set; }
        public string? Nationality { get; set; }
        public string? Disability { get; set; }
        public string? Remark { get; set; }
        public DateTime? StatusDate { get; set; }
        public string? Designation { get; set; }
        public string? Qualification { get; set; }
        public bool? Status { get; set; }
        public DateTime? Dor { get; set; }
        public bool? PatInsured { get; set; }
        public int? CountryNo { get; set; }
        public string? Title { get; set; }
        public string? FileNo { get; set; }
        public int? DepartmentNo { get; set; }
        public int? CompanyNo { get; set; }
        public int? BranchNo { get; set; }
        public string? EmployeePinNo { get; set; }
        public string? BankAccountNo { get; set; }
        public string? NSSFNo { get; set; }
        public string? NHIFNo { get; set; }
        public int? EmploymentTypeNo { get; set; }
        public int? Age { get; set; }
        public string? Regby { get; set; }
        public string? NextKin { get; set; }
        public string? NextKinMobile { get; set; }
        public string? NextKinRelationship { get; set; }
        public int? RegisteredBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? PatientPayType { get; set; }
        public string? Father { get; set; }
        public string? Mother { get; set; }
        public string? StaffNo { get; set; }
        public int? BankNo { get; set; }
        public int? BankBranchNo { get; set; }
        public int? MpesaMobileNo { get; set; }
        public string? SalaryPaymentMode { get; set; }
    }
}
