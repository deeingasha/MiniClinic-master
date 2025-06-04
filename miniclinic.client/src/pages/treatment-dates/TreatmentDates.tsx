import { consultations, patients } from "@/data/data";
import { Eye, PlusIcon, Search, User, ArrowRight, DoorClosed } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ConsultationModel } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CustomDatePicker } from "@/components/date-picker";

function TreatmentDates() {
  const navigate = useNavigate();
  const [visibleConsultations, setVisibleConsultations] = useState<
    ConsultationModel[]
  >([]);
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConsultationId, setDeleteConsultationId] = useState<string>("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Format data to include patient name for display
  useEffect(() => {
    // Only format the data in useEffect, don't filter by date here
    const formattedConsultations = consultations.map((consultation) => {
      const patient = patients.find((p) => p.id === consultation.patientId);
      return {
        ...consultation,
        patientName: patient
          ? `${patient.firstName} ${patient.lastName}`
          : "Unknown",
      };
    });

    // Store formatted data and then call filter function
    setVisibleConsultations(formattedConsultations);
    // Apply default filters (today's date) after formatting
    setTimeout(() => filterConsultations(), 0);
  }, []);

  const filterConsultations = () => {
    let filtered = consultations.map((consultation) => {
      const patient = patients.find((p) => p.id === consultation.patientId);
      return {
        ...consultation,
        patientName: patient
          ? `${patient.firstName} ${patient.lastName}`
          : "Unknown",
      };
    });

    // Get the current values directly from state to avoid closure issues
    const currentStartDate = startDate;
    const currentEndDate = endDate;

    // Apply date filter if either start or end date is set
    if (currentStartDate || currentEndDate) {
      filtered = filtered.filter((consultation) => {
        // Convert consultation date to midnight for comparison (just the date part)
        const consultDate = new Date(consultation.date);
        consultDate.setHours(0, 0, 0, 0);

        // If start date is set, check that consultation date is on or after start date
        if (currentStartDate) {
          const compareStartDate = new Date(currentStartDate);
          compareStartDate.setHours(0, 0, 0, 0);

          if (consultDate < compareStartDate) {
            return false;
          }
        }

        // If end date is set, check that consultation date is on or before end date
        if (currentEndDate) {
          const compareEndDate = new Date(currentEndDate);
          compareEndDate.setHours(0, 0, 0, 0);

          if (consultDate > compareEndDate) {
            return false;
          }
        }

        // If we passed all checks, include this consultation
        return true;
      });
    }

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (consultation) =>
          consultation.patientName.toLowerCase().includes(query) ||
          consultation.patientId.toLowerCase().includes(query) ||
          consultation.doctor.firstName.toLowerCase().includes(query) ||
          consultation.doctor.lastName.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter) {
      alert("yooo");
      filtered = filtered.filter(
        (consultation) =>
          consultation.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(
        (consultation) =>
          consultation.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    setVisibleConsultations(filtered);
    setLoading(false); // Simulate network request
  };

  useEffect(() => {
    filterConsultations();
  }, [startDate, endDate, statusFilter, typeFilter]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // Use small timeout to allow state to update
    setTimeout(() => filterConsultations(), 10);
  };

  // Reset all filters to today
  const handleClearFilters = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    setSearchQuery("");
    setStatusFilter("");
    setTypeFilter("");

    // Apply filters after reset with longer timeout
    setTimeout(() => filterConsultations(), 100);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (consultationId: string) => {
    setDeleteConsultationId(consultationId);
    setOpenDeleteDialog(true);
  };

  // Handle delete
  const handleDelete = () => {
    // In a real app, this would make an API call to delete the consultation
    const updatedConsultations = visibleConsultations.filter(
      (consultation) => consultation.id !== deleteConsultationId
    );
    setVisibleConsultations(updatedConsultations);
    setOpenDeleteDialog(false);
  };

  // Define columns with status coloring and actions
  const columns: ColumnDef<ConsultationModel>[] = [
    {
      accessorKey: "patientId",
      // accessorFn: (row) =>{
      //     return(
      //     <div className="flex flex-col py-1 space-y-1">
      //         <span className="text-sm text-primary" >{row.patientId}</span>
      //         <span>{row.patientName}</span>
      //     </div>
      // )},
      header: "Patient",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col py-1 space-y-1">
            <span className="text-sm text-primary">
              {row.getValue("patientId")}
            </span>
            <span>{row.original.patientName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Visit Date",
      cell: ({ row }) => format(row.getValue("date"), "PPP"),
    },
    {
      accessorKey: "date",
      header: "Visit Time",
      cell: ({ row }) => format(row.getValue("date"), "h:mm a"),
    },
    { accessorKey: "type", header: "Treatment Type" },
    { accessorKey: "paymentType", header: "Payment Type" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let color;

        switch (status.toLowerCase()) {
          case "open":
            color = "bg-green-100 text-green-800";
            break;
          case "closed":
            color = "bg-gray-100 text-gray-800";
            break;
          case "scheduled":
            color = "bg-blue-100 text-blue-800";
            break;
          case "completed":
            color = "bg-emerald-100 text-emerald-800";
            break;
          case "cancelled":
            color = "bg-red-100 text-red-800";
            break;
          case "pending":
            color = "bg-amber-100 text-amber-800";
            break;
          default:
            color = "bg-gray-100 text-gray-800";
        }

        return (
          <Badge variant="outline" className={color}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "doctor",
      header: "Doctor",
      accessorFn: (row) => {
        return `${row.doctor.firstName} ${row.doctor.lastName}`;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const consultation = row.original;

        return (
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-primary border-primary"
              asChild
            >
              <Link to={`/healthcare/treatment-dates/${consultation.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>

            {row.original.status === "open" ? (
              <Button
                variant="outline"
                onClick={() => handleDeleteConfirm(consultation.id)}
                className="p-0 text-amber-600 border-amber-600"
              >
                <DoorClosed className="h-4 w-4" />
                <span className="">Close</span>
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  const [addTreatmentDateOpen, setAddTreatmentDateOpen] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(patients);

  return (
    <div className="p-6 bg-white shadow">
      <div className="mb-6">
        <div className="flex justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Treatment Dates</h1>
            <p className="text-gray-500">
              Manage and view all patient treatment dates and appointments
            </p>
          </div>
          <Button
            className="py-6 text-lg"
            onClick={() => setAddTreatmentDateOpen(true)}
          >
            <PlusIcon /> Add Treatment Date
          </Button>

          <Dialog
            open={addTreatmentDateOpen}
            onOpenChange={setAddTreatmentDateOpen}
          >
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-medium">Select a Patient</h3>
                  <p className="text-sm text-muted-foreground">
                    Search and select a patient to create a new treatment date
                  </p>
                </div>

                <div className="flex w-full items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients by name, ID, or phone..."
                      className="pl-8"
                      value={patientSearchQuery}
                      onChange={(e) => {
                        const query = e.target.value.toLowerCase();
                        setPatientSearchQuery(query);

                        // Filter patients based on search query
                        const filtered = patients.filter((patient) => {
                          return (
                            patient.id?.toLowerCase().includes(query) ||
                            patient.firstName?.toLowerCase().includes(query) ||
                            patient.lastName?.toLowerCase().includes(query) ||
                            patient.phone?.toLowerCase().includes(query) ||
                            `${patient.firstName} ${patient.lastName}`
                              .toLowerCase()
                              .includes(query)
                          );
                        });

                        setFilteredPatients(filtered);
                      }}
                    />
                  </div>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(patientSearchQuery ? filteredPatients : patients).map(
                        (patient) => (
                          <TableRow
                            key={patient.id}
                            className="cursor-pointer hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              {patient.id}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                {patient.firstName} {patient.lastName}
                              </div>
                            </TableCell>
                            <TableCell>{patient.phone}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setAddTreatmentDateOpen(false);
                                  // Navigate to the patient details
                                  navigate(
                                    `/healthcare/entity-registration/${patient.id}`
                                  );
                                }}
                              >
                                <ArrowRight className="h-4 w-4" />
                                <span className="sr-only">View Patient</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-lg font-medium">Filters</h3>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Updating results...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Search Bar */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Patient name, ID or doctor..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 w-full"
              />
            </div>
          </div>


            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setTimeout(() => filterConsultations(), 0);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Patient Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Treatment Type
              </label>
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inpatient">Inpatient</SelectItem>
                  <SelectItem value="outpatient">Outpatient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="md:col-span-4 flex space-x-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <CustomDatePicker
                  value={startDate || undefined}
                  onChange={(date) => setStartDate(date as Date)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <CustomDatePicker
                  value={endDate || undefined}
                  onChange={(date) => setEndDate(date as Date)}
                />
              </div>
            </div>

            {/* Clear Button */}
            <div className="md:col-span-1 flex justify-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                disabled={loading}
                className="h-10 w-full"
              >
                Reset
              </Button>
            </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <DataTable
          columns={columns}
          data={visibleConsultations}
          searchKey="patientName"
          searchPlaceholder="Filter by patient name..."
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to close this treatment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently close the
              treatment record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default TreatmentDates;
