// src/api/mutation/entityMutations.ts
import { CreateEntityDto, UpdateEntityDto } from '@/types/EntityDto';

const API_URL = '/api/entity';  // Base URL for entity endpoints

// Create a new entity
export const createEntity = async (entity: CreateEntityDto) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PatientNo: entity.patientNo,
        FName: entity.firstName,
        MName: entity.middleName,
        LName: entity.lastName,
        DOB: entity.dob,
        Sex: entity.sex,
        EntityTypeCode: entity.entityTypeCode,
        IdType: entity.idType,
        IdNo: entity.idNumber,
        MaritalStatus: entity.maritalStatus,
        Nationality: entity.nationality,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating entity:', error);
    throw error;
  }
};

// Update an existing entity
export const updateEntity = async (entity: UpdateEntityDto) => {
  try {
    const response = await fetch(`${API_URL}/${entity.entityNo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        EntityNo: entity.entityNo,
        PatientNo: entity.patientNo,
        FName: entity.firstName,
        MName: entity.middleName,
        LName: entity.lastName,
        DOB: entity.dob,
        Sex: entity.sex,
        EntityTypeCode: entity.entityTypeCode,
        IdType: entity.idType,
        IdNo: entity.idNumber,
        MaritalStatus: entity.maritalStatus,
        Nationality: entity.nationality,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating entity:', error);
    throw error;
  }
};