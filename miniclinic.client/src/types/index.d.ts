export interface UserModel{
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    password?: string;
    role: "doctor" | "nurse" | "receptionist" | "patient" | "admin" | "finance" | "pathologist" | "pharmacist";
    email: string;
    phone: string;
    shift: "day" | "night" | undefined;
    department: string | undefined;
}


export interface InsuranceModel{
    patientId: string;
    firstName: string;
    lastName: string;
    coverage: string;
    provider: string;
    relationship: string;
}


export interface PatientModel extends Partial<UserModel>{
    insurance: InsuranceModel | undefined;
    bloodPressure: string | undefined;
    height: string | undefined;
    weight: string | undefined;
    bmi: string | undefined;
    dateOfBirth: Date | undefined;
    idType: string | undefined;
    sex: "male" | "female";
    idNumber: string | undefined;
    passportNumber: string | undefined;
    address: string | undefined;
    maritalStatus: "single" | "married" | "widowed" | "divorced";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ConsultationModel{
    id: string;
    patientId: string;
    patient: PatientModel;
    paymentType: "cash" | "insurance" | "direct";
    doctorId: string;
    doctor: UserModel;
    type: "inpatient" | "outpatient";
    status: "open" | "closed" | "scheduled" | "completed" | "cancelled" | "pending";
    stage: "registration" | "triage" | "doctor" | "lab";
    date: Date;
    notes?: string;
    patientName?: string;
}

export interface OrderModel {
    id: string;
    date: string;
    supplier: string;
    lpoNo: string;
    status: string;
    totalItems: number;
    totalAmount: number;
    drugs: string[];
}


export interface DrugModel{
    name: string,
    code: string,
    type: string,
    manufacturer: string,
    stock: number
}
