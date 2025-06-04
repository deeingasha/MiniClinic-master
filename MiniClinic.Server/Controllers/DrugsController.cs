using Microsoft.AspNetCore.Mvc;

namespace MiniClinic.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DrugsController : ControllerBase
    {
        public class Drug
        {
            public required string Name { get; set; }
            public required string Code { get; set; }
            public required string Type { get; set; }
            public required string Manufacturer { get; set; }
            public required int Stock { get; set; }
        }

        private static readonly List<Drug> Drugs =
        [
            new() { Name = "Paracetamol", Code = "DRUG-001", Type = "Analgesic", Manufacturer = "GlaxoSmithKline", Stock = 500 },
            new() { Name = "Amoxicillin", Code = "DRUG-002", Type = "Antibiotic", Manufacturer = "Pfizer", Stock = 350 },
            new() { Name = "Ibuprofen", Code = "DRUG-003", Type = "Analgesic", Manufacturer = "Johnson & Johnson", Stock = 420 },
            new() { Name = "Loratadine", Code = "DRUG-004", Type = "Antihistamine", Manufacturer = "Bayer", Stock = 280 },
            new() { Name = "Metformin", Code = "DRUG-005", Type = "Antidiabetic", Manufacturer = "Merck", Stock = 180 },
            new() { Name = "Atorvastatin", Code = "DRUG-006", Type = "Statin", Manufacturer = "Pfizer", Stock = 200 },
            new() { Name = "Omeprazole", Code = "DRUG-007", Type = "Proton Pump Inhibitor", Manufacturer = "AstraZeneca", Stock = 320 },
            new() { Name = "Salbutamol", Code = "DRUG-008", Type = "Bronchodilator", Manufacturer = "GlaxoSmithKline", Stock = 150 },
            new() { Name = "Diazepam", Code = "DRUG-009", Type = "Benzodiazepine", Manufacturer = "Roche", Stock = 100 },
            new() { Name = "Ciprofloxacin", Code = "DRUG-010", Type = "Antibiotic", Manufacturer = "Bayer", Stock = 250 },
            new() { Name = "Hydrochlorothiazide", Code = "DRUG-011", Type = "Diuretic", Manufacturer = "Novartis", Stock = 180 },
            new() { Name = "Fluoxetine", Code = "DRUG-012", Type = "SSRI", Manufacturer = "Eli Lilly", Stock = 120 },
            new() { Name = "Warfarin", Code = "DRUG-013", Type = "Anticoagulant", Manufacturer = "Bristol-Myers Squibb", Stock = 90 },
            new() { Name = "Morphine", Code = "DRUG-014", Type = "Analgesic", Manufacturer = "Purdue Pharma", Stock = 50 },
            new() { Name = "Levothyroxine", Code = "DRUG-015", Type = "Thyroid Hormone", Manufacturer = "Abbott", Stock = 220 },
            new() { Name = "Aspirin", Code = "DRUG-016", Type = "Analgesic", Manufacturer = "Bayer", Stock = 600 },
            new() { Name = "Ceftriaxone", Code = "DRUG-017", Type = "Antibiotic", Manufacturer = "Pfizer", Stock = 180 },
            new() { Name = "Lisinopril", Code = "DRUG-018", Type = "ACE Inhibitor", Manufacturer = "Merck", Stock = 240 },
            new() { Name = "Ventolin", Code = "DRUG-019", Type = "Bronchodilator", Manufacturer = "GlaxoSmithKline", Stock = 120 },
            new() { Name = "Simvastatin", Code = "DRUG-020", Type = "Statin", Manufacturer = "Merck", Stock = 190 }
        ];

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(Drugs);
        }

        [HttpGet("code/{code}")]
        public IActionResult GetByCode(string code)
        {
            var drug = Drugs.FirstOrDefault(d => d.Code.Equals(code, StringComparison.OrdinalIgnoreCase));
            if (drug == null) return NotFound();
            return Ok(drug);
        }

        [HttpGet("type/{type}")]
        public IActionResult GetByType(string type)
        {
            var result = Drugs.Where(d => d.Type.Equals(type, StringComparison.OrdinalIgnoreCase)).ToList();
            if (!result.Any()) return NotFound();
            return Ok(result);
        }

        [HttpGet("manufacturer/{manufacturer}")]
        public IActionResult GetByManufacturer(string manufacturer)
        {
            var result = Drugs.Where(d => d.Manufacturer.Equals(manufacturer, StringComparison.OrdinalIgnoreCase)).ToList();
            if (!result.Any()) return NotFound();
            return Ok(result);
        }
    }
}

