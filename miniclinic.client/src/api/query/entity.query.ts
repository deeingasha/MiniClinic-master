// src/api/query/entityQueries.ts
import { EntityDto } from '../../types/EntityDto';

const API_URL = '/api/entity';  // Base URL for entity endpoints

// Get all entities
export const getAllEntities = async (queryParams?: string): Promise<{
  items: EntityDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}> => {
  try {
    // Construct URL with query parameters if provided
    const url = queryParams ? `${API_URL}?${queryParams}` : API_URL;
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching entities:', error);
    throw error;
  }
};

// Get entity by entityNo
export const getEntityByNo = async (entityNo: string): Promise<EntityDto> => {
  try {
    const response = await fetch(`${API_URL}/${entityNo}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching entity with ID ${entityNo}:`, error);
    throw error;
  }
};