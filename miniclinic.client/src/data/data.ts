import { UserModel, PatientModel, ConsultationModel, DrugModel, OrderModel } from '../types';

const users: UserModel[] = [
    {
        id: "USR-001",
        firstName: "James",
        lastName: "Williams",
        username: "doctor",
        password: "password123",
        role: "doctor",
        email: "james.williams@clinic.com",
        phone: "+1 (555) 123-4567",
        shift: "day",
        department: "General Medicine"
    },
    {
        id: "USR-002",
        firstName: "Emily",
        lastName: "Johnson",
        username: "doctor1",
        password: "password123",
        role: "nurse",
        email: "emily.johnson@clinic.com",
        phone: "+1 (555) 234-5678",
        shift: "night",
        department: "Emergency"
    },
    {
        id: "USR-003",
        firstName: "Michael",
        lastName: "Brown",
        username: "receptionist",
        password: "password123",
        role: "receptionist",
        email: "michael.brown@clinic.com",
        phone: "+1 (555) 345-6789",
        shift: "day",
        department: "Administration"
    },
    // another doctor of role pathologist
    {
        id: "USR-004",
        firstName: "Sarah",
        lastName: "Davis",
        username: "pathologist",
        password: "password123",
        role: "pathologist",
        email: "sarah.davis@clinic.com",
        phone: "+1 (555) 123-4567",
        shift: "day",
        department: "General Medicine"
    },
    // Admin user
    {
        id: "USR-005",
        firstName: "Admin",
        lastName: "User",
        username: "admin",
        password: "password123",
        role: "admin",
        email: "admin@clinic.com",
        phone: "+1 (555) 111-1111",
        shift: "day",
        department: "Administration"
    },
    // Finance user
    {
        id: "USR-006",
        firstName: "Finance",
        lastName: "Manager",
        username: "finance",
        password: "password123",
        role: "finance",
        email: "finance@clinic.com",
        phone: "+1 (555) 222-2222",
        shift: "day",
        department: "Finance"
    }
]

const patients: PatientModel[] = [
    {
        id: "PAT-001",
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "password123",
        role: "patient",
        email: "john.doe@email.com",
        phone: "+1 (555) 111-2222",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-001",
            firstName: "John",
            lastName: "Doe",
            coverage: "Full",
            provider: "BlueCross",
            relationship: "Self"
        },
        bloodPressure: "120/80",
        height: "175",
        weight: "70",
        bmi: "22.9",
        dateOfBirth: new Date(1985, 5, 15),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-002",
        firstName: "Jane",
        lastName: "Smith",
        username: "janesmith",
        password: "password123",
        role: "patient",
        email: "jane.smith@email.com",
        phone: "+1 (555) 222-3333",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-002",
            firstName: "Jane",
            lastName: "Smith",
            coverage: "Partial",
            provider: "Aetna",
            relationship: "Self"
        },
        bloodPressure: "118/75",
        height: "165",
        weight: "60",
        bmi: "22.0",
        dateOfBirth: new Date(1990, 3, 20),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-003",
        firstName: "Robert",
        lastName: "Johnson",
        username: "robert.j",
        password: "robert789",
        role: "patient",
        email: "robert.johnson@email.com",
        phone: "+1 (555) 333-4444",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-003",
            firstName: "Robert",
            lastName: "Johnson",
            coverage: "Full",
            provider: "UnitedHealth",
            relationship: "Self"
        },
        bloodPressure: "125/85",
        height: "180",
        weight: "85",
        bmi: "26.2",
        dateOfBirth: new Date(1982, 9, 10),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-004",
        firstName: "Maria",
        lastName: "Garcia",
        username: "maria.g",
        password: "maria123",
        role: "patient",
        email: "maria.garcia@email.com",
        phone: "+1 (555) 444-5555",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-004",
            firstName: "Maria",
            lastName: "Garcia",
            coverage: "Partial",
            provider: "Cigna",
            relationship: "Self"
        },
        bloodPressure: "110/70",
        height: "160",
        weight: "55",
        bmi: "21.5",
        dateOfBirth: new Date(1995, 7, 25),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-005",
        firstName: "David",
        lastName: "Brown",
        username: "david.b",
        password: "david456",
        role: "patient",
        email: "david.brown@email.com",
        phone: "+1 (555) 555-6666",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-005",
            firstName: "David",
            lastName: "Brown",
            coverage: "Full",
            provider: "Humana",
            relationship: "Self"
        },
        bloodPressure: "130/85",
        height: "185",
        weight: "90",
        bmi: "26.3",
        dateOfBirth: new Date(1975, 11, 5),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-006",
        firstName: "Elizabeth",
        lastName: "Wilson",
        username: "elizabeth.w",
        password: "lizzy789",
        role: "patient",
        email: "elizabeth.wilson@email.com",
        phone: "+1 (555) 666-7777",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-006",
            firstName: "Elizabeth",
            lastName: "Wilson",
            coverage: "Partial",
            provider: "Kaiser",
            relationship: "Self"
        },
        bloodPressure: "115/75",
        height: "162",
        weight: "58",
        bmi: "22.1",
        dateOfBirth: new Date(1988, 2, 18),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-007",
        firstName: "Michael",
        lastName: "Davis",
        username: "michael.d",
        password: "mike123",
        role: "patient",
        email: "michael.davis@email.com",
        phone: "+1 (555) 777-8888",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-007",
            firstName: "Michael",
            lastName: "Davis",
            coverage: "Full",
            provider: "BlueCross",
            relationship: "Self"
        },
        bloodPressure: "140/90",
        height: "178",
        weight: "82",
        bmi: "25.9",
        dateOfBirth: new Date(1970, 5, 22),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-008",
        firstName: "Sarah",
        lastName: "Martinez",
        username: "sarah.m",
        password: "sarah456",
        role: "patient",
        email: "sarah.martinez@email.com",
        phone: "+1 (555) 888-9999",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-008",
            firstName: "Sarah",
            lastName: "Martinez",
            coverage: "Partial",
            provider: "Aetna",
            relationship: "Self"
        },
        bloodPressure: "112/72",
        height: "168",
        weight: "63",
        bmi: "22.3",
        dateOfBirth: new Date(1992, 4, 12),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-009",
        firstName: "James",
        lastName: "Taylor",
        username: "james.t",
        password: "james789",
        role: "patient",
        email: "james.taylor@email.com",
        phone: "+1 (555) 999-0000",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-009",
            firstName: "James",
            lastName: "Taylor",
            coverage: "Full",
            provider: "UnitedHealth",
            relationship: "Self"
        },
        bloodPressure: "128/82",
        height: "182",
        weight: "88",
        bmi: "26.6",
        dateOfBirth: new Date(1980, 8, 30),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-010",
        firstName: "Jennifer",
        lastName: "Anderson",
        username: "jennifer.a",
        password: "jennifer123",
        role: "patient",
        email: "jennifer.anderson@email.com",
        phone: "+1 (555) 123-4567",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-010",
            firstName: "Jennifer",
            lastName: "Anderson",
            coverage: "Partial",
            provider: "Cigna",
            relationship: "Self"
        },
        bloodPressure: "118/78",
        height: "165",
        weight: "61",
        bmi: "22.4",
        dateOfBirth: new Date(1986, 1, 14),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-011",
        firstName: "Christopher",
        lastName: "Thomas",
        username: "chris.t",
        password: "chris456",
        role: "patient",
        email: "christopher.thomas@email.com",
        phone: "+1 (555) 234-5678",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-011",
            firstName: "Christopher",
            lastName: "Thomas",
            coverage: "Full",
            provider: "Humana",
            relationship: "Self"
        },
        bloodPressure: "132/88",
        height: "183",
        weight: "86",
        bmi: "25.7",
        dateOfBirth: new Date(1978, 10, 8),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-012",
        firstName: "Patricia",
        lastName: "Jackson",
        username: "patricia.j",
        password: "patricia789",
        role: "patient",
        email: "patricia.jackson@email.com",
        phone: "+1 (555) 345-6789",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-012",
            firstName: "Patricia",
            lastName: "Jackson",
            coverage: "Partial",
            provider: "Kaiser",
            relationship: "Self"
        },
        bloodPressure: "114/74",
        height: "163",
        weight: "57",
        bmi: "21.5",
        dateOfBirth: new Date(1991, 6, 27),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-013",
        firstName: "Daniel",
        lastName: "White",
        username: "daniel.w",
        password: "daniel123",
        role: "patient",
        email: "daniel.white@email.com",
        phone: "+1 (555) 456-7890",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-013",
            firstName: "Daniel",
            lastName: "White",
            coverage: "Full",
            provider: "BlueCross",
            relationship: "Self"
        },
        bloodPressure: "126/84",
        height: "179",
        weight: "84",
        bmi: "26.2",
        dateOfBirth: new Date(1983, 3, 3),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-014",
        firstName: "Linda",
        lastName: "Harris",
        username: "linda.h",
        password: "linda456",
        role: "patient",
        email: "linda.harris@email.com",
        phone: "+1 (555) 567-8901",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-014",
            firstName: "Linda",
            lastName: "Harris",
            coverage: "Partial",
            provider: "Aetna",
            relationship: "Self"
        },
        bloodPressure: "110/70",
        height: "160",
        weight: "56",
        bmi: "21.9",
        dateOfBirth: new Date(1989, 9, 15),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    },
    {
        id: "PAT-015",
        firstName: "Matthew",
        lastName: "Clark",
        username: "matthew.c",
        password: "matthew789",
        role: "patient",
        email: "matthew.clark@email.com",
        phone: "+1 (555) 678-9012",
        shift: undefined,
        department: undefined,
        insurance: {
            patientId: "PAT-015",
            firstName: "Matthew",
            lastName: "Clark",
            coverage: "Full",
            provider: "UnitedHealth",
            relationship: "Self"
        },
        bloodPressure: "138/88",
        height: "181",
        weight: "87",
        bmi: "26.6",
        dateOfBirth: new Date(1976, 7, 20),
        idType: undefined,
        sex: 'male',
        idNumber: undefined,
        passportNumber: undefined,
        address: undefined,
        maritalStatus: 'single'
    }
];

const allEntities: UserModel[] = [...patients.filter(p => p.id !== undefined) as UserModel[], ...users];

const consultations: ConsultationModel[] = [
    {
        id: "CONS-001",
        patientId: "PAT-001",
        doctorId: "USR-001",
        patient: patients[0],
        doctor: users[0],
        type: "outpatient",
        status: "open",
        stage: "registration",
        date: new Date(2025, 2, 10),
        paymentType: "cash"
    },
    {
        id: "CONS-002",
        patientId: "PAT-002",
        doctorId: "USR-001",
        patient: patients[1],
        doctor: users[0],
        type: "outpatient",
        status: "open",
        stage: "triage",
        date: new Date(new Date().setHours(10, 0, 0, 0)),
        paymentType: "cash"
    },
    {
        id: "CONS-003",
        patientId: "PAT-003",
        doctorId: "USR-001",
        patient: patients[2],
        doctor: users[0],
        type: "inpatient",
        status: "open",
        stage: "doctor",
        date: new Date(2025, 2, 11),
        paymentType: "cash"
    },
    {
        id: "CONS-004",
        patientId: "PAT-004",
        doctorId: "USR-001",
        patient: patients[3],
        doctor: users[0],
        type: "outpatient",
        status: "open",
        stage: "lab",
        date: new Date(2025, 2, 11),
        paymentType: "insurance"
    },
    {
        id: "CONS-005",
        patientId: "PAT-005",
        doctorId: "USR-001",
        patient: patients[4],
        doctor: users[0],
        type: "outpatient",
        status: "closed",
        stage: "doctor",
        date: new Date(2025, 2, 9),
        paymentType: "direct"
    },
    {
        id: "CONS-006",
        patientId: "PAT-006",
        doctorId: "USR-001",
        patient: patients[5],
        doctor: users[3],
        type: "inpatient",
        status: "open",
        stage: "registration",
        date: new Date(new Date().setHours(8, 0, 0, 0)),
        paymentType: "direct"
    },
    {
        id: "CONS-007",
        patientId: "PAT-007",
        doctorId: "USR-001",
        patient: patients[6],
        doctor: users[0],
        type: "outpatient",
        status: "open",
        stage: "triage",
        date: new Date(2025, 2, 12),
        paymentType: "direct"
    },
    {
        id: "CONS-008",
        patientId: "PAT-008",
        doctorId: "USR-001",
        patient: patients[7],
        doctor: users[3],
        type: "outpatient",
        status: "open",
        stage: "doctor",
        date: new Date(2025, 2, 13),
        paymentType: "insurance"
    },
    {
        id: "CONS-009",
        patientId: "PAT-009",
        doctorId: "USR-001",
        patient: patients[8],
        doctor: users[0],
        type: "inpatient",
        status: "open",
        stage: "lab",
        date: new Date(2025, 2, 13),
        paymentType: "insurance"
    },
    {
        id: "CONS-010",
        patientId: "PAT-010",
        doctorId: "USR-001",
        patient: patients[9],
        doctor: users[0],
        type: "outpatient",
        status: "closed",
        stage: "doctor",
        date: new Date(2025, 2, 8),
        paymentType: "direct"
    },
    {
        id: "CONS-011",
        patientId: "PAT-011",
        doctorId: "USR-001",
        patient: patients[10],
        doctor: users[3],
        type: "outpatient",
        status: "open",
        stage: "registration",
        date: new Date(2025, 2, 14),
        paymentType: "direct"
    },
    {
        id: "CONS-012",
        patientId: "PAT-012",
        doctorId: "USR-001",
        patient: patients[11],
        doctor: users[0],
        type: "inpatient",
        status: "open",
        stage: "triage",
        date: new Date(2025, 2, 14),
        paymentType: "insurance"
    },
    {
        id: "CONS-013",
        patientId: "PAT-013",
        doctorId: "USR-001",
        type: "outpatient",
        status: "open",
        stage: "doctor",
        date: new Date(2025, 2, 15),
        patient: patients[12],
        doctor: users[3],
        paymentType: "direct"
    },
    {
        id: "CONS-014",
        patientId: "PAT-014",
        doctorId: "USR-001",
        type: "outpatient",
        status: "open",
        stage: "lab",
        date: new Date(2025, 2, 15),
        patient: patients[13],
        doctor: users[3],
        paymentType: "direct"
    },
    {
        id: "CONS-015",
        patientId: "PAT-015",
        doctorId: "USR-001",
        type: "inpatient",
        status: "closed",
        stage: "doctor",
        date: new Date(2025, 2, 7),
        patient: patients[14],
        doctor: users[3],
        paymentType: "insurance"
    }
];

const drugs: DrugModel[] = [
    {
        name: "Paracetamol",
        code: "DRUG-001",
        type: "Analgesic",
        manufacturer: "GlaxoSmithKline",
        stock: 500
    },
    {
        name: "Amoxicillin",
        code: "DRUG-002",
        type: "Antibiotic",
        manufacturer: "Pfizer",
        stock: 350
    },
    {
        name: "Ibuprofen",
        code: "DRUG-003",
        type: "Analgesic", // Repeated type
        manufacturer: "Johnson & Johnson",
        stock: 420
    },
    {
        name: "Loratadine",
        code: "DRUG-004",
        type: "Antihistamine",
        manufacturer: "Bayer",
        stock: 280
    },
    {
        name: "Metformin",
        code: "DRUG-005",
        type: "Antidiabetic",
        manufacturer: "Merck",
        stock: 180
    },
    {
        name: "Atorvastatin",
        code: "DRUG-006",
        type: "Statin",
        manufacturer: "Pfizer", // Repeated manufacturer
        stock: 200
    },
    {
        name: "Omeprazole",
        code: "DRUG-007",
        type: "Proton Pump Inhibitor",
        manufacturer: "AstraZeneca",
        stock: 320
    },
    {
        name: "Salbutamol",
        code: "DRUG-008",
        type: "Bronchodilator",
        manufacturer: "GlaxoSmithKline", // Repeated manufacturer
        stock: 150
    },
    {
        name: "Diazepam",
        code: "DRUG-009",
        type: "Benzodiazepine",
        manufacturer: "Roche",
        stock: 100
    },
    {
        name: "Ciprofloxacin",
        code: "DRUG-010",
        type: "Antibiotic", // Repeated type
        manufacturer: "Bayer", // Repeated manufacturer
        stock: 250
    },
    {
        name: "Hydrochlorothiazide",
        code: "DRUG-011",
        type: "Diuretic",
        manufacturer: "Novartis",
        stock: 180
    },
    {
        name: "Fluoxetine",
        code: "DRUG-012",
        type: "SSRI",
        manufacturer: "Eli Lilly",
        stock: 120
    },
    {
        name: "Warfarin",
        code: "DRUG-013",
        type: "Anticoagulant",
        manufacturer: "Bristol-Myers Squibb",
        stock: 90
    },
    {
        name: "Morphine",
        code: "DRUG-014",
        type: "Analgesic", // Repeated type
        manufacturer: "Purdue Pharma",
        stock: 50
    },
    {
        name: "Levothyroxine",
        code: "DRUG-015",
        type: "Thyroid Hormone",
        manufacturer: "Abbott",
        stock: 220
    },
    {
        name: "Aspirin",
        code: "DRUG-016",
        type: "Analgesic", // Repeated type
        manufacturer: "Bayer", // Repeated manufacturer
        stock: 600
    },
    {
        name: "Ceftriaxone",
        code: "DRUG-017",
        type: "Antibiotic", // Repeated type
        manufacturer: "Pfizer", // Repeated manufacturer
        stock: 180
    },
    {
        name: "Lisinopril",
        code: "DRUG-018",
        type: "ACE Inhibitor",
        manufacturer: "Merck", // Repeated manufacturer
        stock: 240
    },
    {
        name: "Ventolin",
        code: "DRUG-019",
        type: "Bronchodilator", // Repeated type
        manufacturer: "GlaxoSmithKline", // Repeated manufacturer
        stock: 120
    },
    {
        name: "Simvastatin",
        code: "DRUG-020",
        type: "Statin", // Repeated type
        manufacturer: "Merck", // Repeated manufacturer
        stock: 190
    }
];

const orders: OrderModel[] = [
  {
    id: "PO-001",
    date: "2025-04-01",
    supplier: "Supplier A",
    lpoNo: "LPO-001",
    status: "Pending",
    totalItems: 5,
    totalAmount: 12500,
    drugs: ["Paracetamol", "Amoxicillin", "Ibuprofen"],
  },
  {
    id: "PO-002",
    date: "2025-03-28",
    supplier: "Supplier B",
    lpoNo: "LPO-002",
    status: "Approved",
    totalItems: 3,
    totalAmount: 8750,
    drugs: ["Metformin", "Atorvastatin"],
  },
  {
    id: "PO-003",
    date: "2025-03-25",
    supplier: "Supplier C",
    lpoNo: "LPO-003",
    status: "Completed",
    totalItems: 7,
    totalAmount: 15200,
    drugs: ["Paracetamol", "Metformin", "Atorvastatin"],
  },
  {
    id: "PO-004",
    date: "2025-03-20",
    supplier: "Supplier A",
    lpoNo: "LPO-004",
    status: "Completed",
    totalItems: 4,
    totalAmount: 9800,
    drugs: ["Amoxicillin", "Ibuprofen"],
  },
  {
    id: "PO-005",
    date: "2025-03-15",
    supplier: "Supplier B",
    lpoNo: "LPO-005",
    status: "Cancelled",
    totalItems: 2,
    totalAmount: 4500,
    drugs: ["Paracetamol"],
  },
];

export {
    users,
    patients,
    consultations,
    allEntities,
    drugs,
    orders
};
