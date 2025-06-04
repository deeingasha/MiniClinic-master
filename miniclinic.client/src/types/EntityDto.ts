// src/types/EntityDto.ts
export interface EntityDto {
    entityNo?: string;
    patientNo?: string;
    fName: string;
    mName?: string;
    lName: string;
    dob?: Date;
    sex?: string;  
    entityTypeCode: 'PAT' | 'STA';
    idType?: string;
    idNumber?: string;
    maritalStatus?: string;
    nationality?: string;
    disability?: string;
    remark?: string;
    statusDate?: Date;
    designation?: string;
    qualification?: string;
    status?: boolean;
    dor?: Date;
    patInsured?: boolean;
    countryNo?: number;
    title?: string;
    fileNo?: string;
    departmentNo?: number;
    companyNo?: number;
    branchNo?: number;
    employeePinNo?: string;
    phone?: string;
    email?: string;
    address?: string;
  }
  
  // For creating new entities
  export interface CreateEntityDto {
    patientNo?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dob?: Date;
    sex?: string;
    entityTypeCode: 'PAT' | 'STA';
    idType?: string;
    idNumber?: string;
    maritalStatus?: string;
    nationality?: string;
    phone?: string;
    email?: string;
    address?: string;
  }
  
  // For updating existing entities
  export interface UpdateEntityDto extends CreateEntityDto {
    entityNo: string;
  }