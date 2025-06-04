import { useState, useEffect } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
import { UserModel } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { UserPlus, Filter, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import EntityRegistrationForm from './EntityRegistrationForm'
import { Link } from 'react-router-dom'
import { DialogContent, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog'
import { getAllEntities } from '@/api/query/entity.query'
import { EntityDto } from '@/types/EntityDto'
import { format } from 'date-fns'

function EntityRegistration() {
    const [allUsers, setAllUsers] = useState<UserModel[]>([])
    const [users, setUsers] = useState<UserModel[]>([])
    const [showForm, setShowForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [selectedEntity, setSelectedEntity] = useState<UserModel | null>(null)
    const [showViewDialog, setShowViewDialog] = useState(false)
    const [roleFilter, setRoleFilter] = useState<string>('')
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPreviousPage, setHasPreviousPage] = useState(false)

    // Fetch entities on component mount or when pagination/filters change
    useEffect(() => {
        const fetchEntities = async () => {
            try {
                setIsLoading(true);
                
                // Build the query parameters
                const params = new URLSearchParams();
                params.append('pageNumber', currentPage.toString());
                params.append('pageSize', pageSize.toString());
                
                if (roleFilter) {
                    params.append('entityTypeCode', roleFilter.toUpperCase());
                }
                
                if (searchQuery) {
                    params.append('searchQuery', searchQuery);
                }
                
                // Call the API with pagination parameters
                const data = await getAllEntities(params.toString());

                // Update pagination state
                setTotalPages(data.totalPages);
                setTotalCount(data.totalCount);
                setHasNextPage(data.hasNextPage);
                setHasPreviousPage(data.hasPreviousPage);
                
                // Convert EntityDto to UserModel format
                const userModels = data.items.map((entity: EntityDto) => ({
                    id: entity.entityNo || '',
                    firstName: entity.fName,
                    lastName: entity.lName + " "+ entity.mName,
                    email: entity.email || '',
                    phone: entity.phone || '',
                    role: entity.entityTypeCode.toLowerCase(), // Assuming entityTypeCode maps to role
                    password: '', // Not needed for display
                    department: '',
                    shift: '',
                    username: '',
                    sex: entity.sex || '',
                    idType: entity.idType || '',
                    idNumber: entity.idNumber || '',
                    dob: entity.dob || '',
                    address: entity.address || '',
                    maritalStatus: entity.maritalStatus || '',
                }) as unknown as UserModel);
                
                setAllUsers(userModels);
                setUsers(userModels);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching entities:', err);
                setError('Failed to fetch entities. Please try again later.');
                setIsLoading(false);
                
                // Fallback to empty array if API fails
                setAllUsers([]);
                setUsers([]);
            }
        };

        fetchEntities();
    }, [currentPage, pageSize, roleFilter, searchQuery]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Handle page size change
    const handlePageSizeChange = (newSize: string) => {
        setPageSize(parseInt(newSize));
        setCurrentPage(1); // Reset to first page when changing page size
    };

    // Apply filters based on role and search query
    useEffect(() => {
        let filteredUsers = [...allUsers];

        // Apply role filter
        if (roleFilter) {
            filteredUsers = filteredUsers.filter(user =>
                user.role.toLowerCase() === roleFilter.toLowerCase()
            );
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredUsers = filteredUsers.filter(user =>
                user.firstName.toLowerCase().includes(query) ||
                user.lastName.toLowerCase().includes(query) ||
                (user.email && user.email.toLowerCase().includes(query)) ||
                (user.id && user.id.toLowerCase().includes(query)) ||
                (user.phone && user.phone.toLowerCase().includes(query))
            );
        }

        setUsers(filteredUsers);
    }, [roleFilter, searchQuery, allUsers]);

    // Handle edit entity
    const handleEdit = (entity: UserModel) => {
        setSelectedEntity(entity)
        setShowEditForm(true)
    }

    // Handle view entity
    const handleView = async (entity: UserModel) => {
        try {
            // Optionally fetch the full entity details from the API
            // const fullEntityDetails = await getEntityByNo(entity.id);
            setSelectedEntity(entity);
            setShowViewDialog(true);
        } catch (err) {
            console.error('Error fetching entity details:', err);
            // Still show dialog with available data
            setSelectedEntity(entity);
            setShowViewDialog(true);
        }
    }

    // Helper function to get entity type color
    const getEntityTypeColor = (role: string) => {
        switch (role.toUpperCase()) {
            case 'PAT':
                return 'bg-blue-100 text-blue-800'
            case 'STA':
                return 'bg-green-100 text-green-800'
            case 'receptionist':
                return 'bg-purple-100 text-purple-800'
            case 'patient':
                return 'bg-amber-100 text-amber-800'
            case 'admin':
                return 'bg-red-100 text-red-800'
            case 'finance':
                return 'bg-emerald-100 text-emerald-800'
            case 'pathologist':
                return 'bg-indigo-100 text-indigo-800'
            case 'pharmacist':
                return 'bg-teal-100 text-teal-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    // Handle entity updated
    const handleEntityUpdated = (updatedEntity: UserModel) => {
        // Update local state with the updated entity
        const updatedAllUsers = allUsers.map(user =>
            user.id === updatedEntity.id ? updatedEntity : user
        );
        
        setAllUsers(updatedAllUsers);

        // Re-apply filters to the updated list
        let updatedUsers = updatedAllUsers;

        if (roleFilter) {
            updatedUsers = updatedUsers.filter(user =>
                user.role.toLowerCase() === roleFilter.toLowerCase()
            );
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            updatedUsers = updatedUsers.filter(user =>
                user.firstName.toLowerCase().includes(query) ||
                user.lastName.toLowerCase().includes(query) ||
                (user.email && user.email.toLowerCase().includes(query)) ||
                (user.id && user.id.toLowerCase().includes(query)) ||
                (user.phone && user.phone.toLowerCase().includes(query))
            );
        }

        setUsers(updatedUsers);
        setShowEditForm(false);
    }

    // Handle add new entity
    const handleAddNew = () => {
        setShowForm(true)
    }

    // Handle form close
    const handleFormClose = () => {
        setShowForm(false)
    }

    // Handle entity created
    const handleEntityCreated = (newEntity: UserModel) => {
        // Update local state with the new entity
        const updatedAllUsers = [...allUsers, newEntity];
        
        setAllUsers(updatedAllUsers);
        
        // Apply the current filters to the updated list
        let updatedUsers = updatedAllUsers;

        if (roleFilter) {
            updatedUsers = updatedUsers.filter(user =>
                user.role.toLowerCase() === roleFilter.toLowerCase()
            );
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            updatedUsers = updatedUsers.filter(user =>
                user.firstName.toLowerCase().includes(query) ||
                user.lastName.toLowerCase().includes(query) ||
                (user.email && user.email.toLowerCase().includes(query)) ||
                (user.id && user.id.toLowerCase().includes(query)) ||
                (user.phone && user.phone.toLowerCase().includes(query))
            );
        }

        setUsers(updatedUsers);
    }

    // Define columns
    const columns: ColumnDef<UserModel>[] = [
        {
            accessorKey: "firstName",
            header: "First Name"
        },
        {
            accessorKey: "lastName",
            header: "Last Name"
        },
        {
            accessorKey: "dob",
            header: "Date of Birth",
            cell: ({ row }) => {
                const dob = row.getValue("dob") as string
                return (
                    <span>
                        {format(new Date(dob), "yyyy-MM-dd")}
                    </span>
                )
            }
        },
        {
            accessorKey: "sex",
            header: "Sex",
            cell: ({ row }) => {
                const sex = (row.getValue("sex") as string).toUpperCase()
                return (
                    <span>
                        {sex}
                    </span>
                )
            }
        },
        {
            accessorKey: "role",
            header: "Entity Type",
            cell: ({ row }) => {
                const role = (row.getValue("role") as string).toUpperCase()
                let color

                switch (role) {
                    case 'PAT':
                        color = 'bg-blue-100 text-blue-800'
                        break
                    case 'STA':
                        color = 'bg-green-100 text-green-800'
                        break
                    case 'DOC':
                        color = 'bg-purple-100 text-purple-800'
                        break
                    case 'patient':
                        color = 'bg-amber-100 text-amber-800'
                        break
                    case 'admin':
                        color = 'bg-red-100 text-red-800'
                        break
                    case 'finance':
                        color = 'bg-emerald-100 text-emerald-800'
                        break
                    case 'pathologist':
                        color = 'bg-indigo-100 text-indigo-800'
                        break
                    case 'pharmacist':
                        color = 'bg-teal-100 text-teal-800'
                        break
                    default:
                        color = 'bg-gray-100 text-gray-800'
                }

                return (
                    <Badge variant="outline" className={color}>{role}</Badge>
                )
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original

                return (
                    <div className="flex gap-2">

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(user)}
                            className="h-8 w-8 p-0 text-blue-600 border-blue-600"
                        >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                        </Button>


                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                            className="h-8 w-8 p-0 text-gray-600 border-gray-600"
                        >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>


                    </div>
                )
            }
        }
    ]

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="mb-2 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Entity Registration</h1>
                    <p className="text-gray-500">Manage users, patients, doctors and other entities</p>
                </div>
                <Button onClick={handleAddNew} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add New Entity
                </Button>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    {/* Search filter */}
                    <div className="md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative w-full">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search by name, email, phone or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 w-full"
                            />
                        </div>
                    </div>

                    {/* Role filter */}
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Entity Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pat">Patient</SelectItem>
                                <SelectItem value="sta">Staff</SelectItem>
                                <SelectItem value="nurse">Nurse</SelectItem>
                                <SelectItem value="receptionist">Receptionist</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="pathologist">Pathologist</SelectItem>
                                <SelectItem value="pharmacist">Pharmacist</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Clear filters button */}
                    <div className="md:col-span-2 flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRoleFilter('');
                                setSearchQuery('');
                            }}
                            className="h-10 w-full"
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            {/* Loading and Error States */}
            {isLoading && (
                <div className="text-center py-8">
                    <p>Loading entities...</p>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                    <p>{error}</p>
                </div>
            )}

            {/* Data Table */}
            {!isLoading && !error && (
                <div className="bg-white rounded-lg shadow-sm">
                    <DataTable
                        columns={columns}
                        data={users}
                        showGlobalFilter={false}
                        showPagination={false}
                    />
                    
                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                        <div className="text-sm text-gray-500">
                            Showing {users.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
                        </div>
                        
                        <div className="flex items-center space-x-6">
                            {/* Page Size Selector */}
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Rows per page</span>
                                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                    <SelectTrigger className="w-20 h-8">
                                        <SelectValue placeholder={pageSize.toString()} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {/* Page Navigation */}
                            <div className="flex items-center space-x-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!hasPreviousPage}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="sr-only">Previous Page</span>
                                </Button>
                                
                                <span className="text-sm">
                                    Page {currentPage} of {totalPages}
                                </span>
                                
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!hasNextPage}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="sr-only">Next Page</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Entity Registration Form */}
            <EntityRegistrationForm
                open={showForm}
                onClose={handleFormClose}
                onEntityCreated={handleEntityCreated}
            />

            {/* Edit Entity Form */}
            {selectedEntity && (
                <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
                    <DialogContent className="min-w-4xl w-full">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-medium">Edit Entity</DialogTitle>
                        </DialogHeader>
                        <EntityRegistrationForm
                            open={showEditForm}
                            onClose={() => setShowEditForm(false)}
                            onEntityCreated={handleEntityUpdated}
                            existingEntity={selectedEntity}
                            isEditing={true}
                        />
                    </DialogContent>
                </Dialog>
            )}

            {/* View Entity Dialog */}
            {selectedEntity && (
                <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                    <DialogContent className="min-w-4xl w-full">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-medium">
                                {selectedEntity.role === 'patient' ? 'Patient Details' : 'Entity Details'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">ID</p>
                                    <p className="font-medium">{selectedEntity.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{selectedEntity.firstName} {selectedEntity.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{selectedEntity.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{selectedEntity.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Entity Type</p>
                                    <Badge variant="outline" className={getEntityTypeColor(selectedEntity.role)}>
                                        {selectedEntity.role}
                                    </Badge>
                                </div>
                            </div>

                            {selectedEntity.role === 'patient' && (
                                <div className="mt-4">
                                    <Link
                                        to={`/healthcare/entity-registration/${selectedEntity.id}`}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        View Full Patient Details
                                    </Link>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default EntityRegistration
