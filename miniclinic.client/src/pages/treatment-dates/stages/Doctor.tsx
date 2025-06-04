import { useState, useEffect } from "react";
import { PatientModel } from "@/types";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stethoscope, Save, X, Plus, FilePenLine, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { DataTable } from "@/components/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useAuthStore } from "@/stores/auth.store";
import LoadingScreen from "@/components/loading-screen";
import { CustomDatePicker } from "@/components/date-picker";

interface DoctorProps {
  patient?: PatientModel;
}

// Sample diagnosis history - replace with actual API call in production
const diagnosisHistory = [
  {
    id: 1,
    date: "2025-03-15",
    label: "Respiratory infection - Mar 15",
    doctorName: "Dr. Michael Johnson",
    medicalHistory:
      "Patient presented with fever and cough for 3 days. No previous respiratory issues.",
    diagnosis1: "Acute bronchitis",
    diagnosis2: "Dehydration",
    diagnosis3: "",
    remarks: "Advised rest and increased fluid intake",
  },
  {
    id: 2,
    date: "2025-02-20",
    label: "Hypertension check - Feb 20",
    doctorName: "Dr. Sarah Williams",
    medicalHistory:
      "Regular blood pressure monitoring. Patient reports occasional headaches.",
    diagnosis1: "Essential hypertension",
    diagnosis2: "Stress-related headaches",
    diagnosis3: "",
    remarks: "Continue medication. Advised stress management techniques.",
  },
  {
    id: 3,
    date: "2025-01-10",
    label: "Diabetes follow-up - Jan 10",
    doctorName: "Dr. David Chen",
    medicalHistory:
      "Regular diabetes check-up. Blood glucose levels have been stable.",
    diagnosis1: "Type 2 diabetes mellitus",
    diagnosis2: "Peripheral neuropathy",
    diagnosis3: "Hypertension",
    remarks: "Continue current medication regimen. Schedule eye examination.",
  },
];

interface DiagnosisEntry {
  id: number;
  doctorName: string;
  medicalHistory: string;
  diagnosis1: string;
  diagnosis2: string;
  diagnosis3: string;
  remarks: string;
  date: Date;
}

const formSchema = z.object({
  diagnosisId: z.string().optional(),
  doctorName: z.string().optional(),
  medicalHistory: z.string().min(1, "Medical history is required"),
  diagnosis1: z.string().min(1, "Primary diagnosis is required"),
  diagnosis2: z.string().optional(),
  diagnosis3: z.string().optional(),
  remarks: z.string().optional(),
  date: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

function Doctor({ patient }: DoctorProps) {
  const { user } = useAuthStore();

  if (user === null) {
    return <LoadingScreen />;
  }

  const [diagnosisEntries, setDiagnosisEntries] = useState<DiagnosisEntry[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDiagnosis, setEditingDiagnosis] = useState<number | null>(null);
  const [deletingDiagnosis, setDeletingDiagnosis] = useState<number | null>(
    null
  );

  console.log(patient);
  4;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnosisId: "",
      doctorName: `${user.firstName} ${user.lastName}`,
      medicalHistory: "",
      diagnosis1: "",
      diagnosis2: "",
      diagnosis3: "",
      remarks: "",
      date: new Date(),
    },
  });

  // Initialize diagnosis entries with mock data
  useEffect(() => {
    // Convert the diagnosis history to DiagnosisEntry format
    const initialEntries = diagnosisHistory.map((item) => ({
      id: item.id,
      doctorName: item.doctorName,
      medicalHistory: item.medicalHistory,
      diagnosis1: item.diagnosis1,
      diagnosis2: item.diagnosis2,
      diagnosis3: item.diagnosis3 || "",
      remarks: item.remarks,
      date: new Date(item.date),
    }));

    setDiagnosisEntries(initialEntries);
  }, []);

  const loadDiagnosis = (diagnosisId: number) => {
    // Find the selected diagnosis from the history
    const selectedDiagnosis = diagnosisHistory.find(
      (d) => d.id === diagnosisId
    );

    if (selectedDiagnosis) {
      // Populate the form with the fetched data
      form.reset({
        diagnosisId: diagnosisId.toString(),
        doctorName: selectedDiagnosis.doctorName,
        medicalHistory: selectedDiagnosis.medicalHistory,
        diagnosis1: selectedDiagnosis.diagnosis1,
        diagnosis2: selectedDiagnosis.diagnosis2 || "",
        diagnosis3: selectedDiagnosis.diagnosis3 || "",
        remarks: selectedDiagnosis.remarks || "",
        date: new Date(selectedDiagnosis.date),
      });

      setEditingDiagnosis(diagnosisId);
      setIsModalOpen(true);
    }
  };

  const handleAddNewDiagnosis = () => {
    // Reset the form for a new diagnosis
    form.reset({
      diagnosisId: "",
      doctorName: "",
      medicalHistory: "",
      diagnosis1: "",
      diagnosis2: "",
      diagnosis3: "",
      remarks: "",
      date: new Date(),
    });

    setEditingDiagnosis(null);
    setIsModalOpen(true);
  };

  const onSubmit = (data: FormData) => {
    console.log("Saving diagnosis data:", data);

    if (editingDiagnosis) {
      // Update existing entry
      setDiagnosisEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === editingDiagnosis
            ? {
                ...entry,
                doctorName: `${user.firstName} ${user.lastName}`,
                medicalHistory: data.medicalHistory,
                diagnosis1: data.diagnosis1,
                diagnosis2: data.diagnosis2 || "",
                diagnosis3: data.diagnosis3 || "",
                remarks: data.remarks || "",
                date: data.date ?? new Date(),
              }
            : entry
        )
      );
    } else {
      // Add the new entry to the table
      const newEntry: DiagnosisEntry = {
        id: Date.now(), // Use timestamp as temporary ID
        doctorName: `${user.firstName} ${user.lastName}`,
        medicalHistory: data.medicalHistory,
        diagnosis1: data.diagnosis1,
        diagnosis2: data.diagnosis2 || "",
        diagnosis3: data.diagnosis3 || "",
        remarks: data.remarks || "",
        date: data.date ?? new Date(),
      };

      setDiagnosisEntries((prevEntries) => [...prevEntries, newEntry]);
    }

    // Close the modal
    setIsModalOpen(false);
    setEditingDiagnosis(null);

    // In a real app, you would save this to your database
    console.log("Diagnosis data saved!");
  };

  const handleDelete = (diagnosisId: number) => {
    setDeletingDiagnosis(diagnosisId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingDiagnosis) {
      setDiagnosisEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== deletingDiagnosis)
      );
      setIsDeleteDialogOpen(false);
      setDeletingDiagnosis(null);
      console.log("Diagnosis deleted successfully!");
    }
  };

  // Define columns for DataTable
  const columns: ColumnDef<DiagnosisEntry>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "doctorName",
      header: "Doctor Name",
    },
    {
      accessorKey: "medicalHistory",
      header: "Medical History & Examination",
      cell: ({ row }) => {
        const value = row.getValue("medicalHistory") as string;
        return (
          <div className="max-w-[250px] truncate" title={value}>
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: "diagnosis1",
      header: "Diagnosis 1",
    },
    {
      accessorKey: "diagnosis2",
      header: "Diagnosis 2",
    },
    {
      accessorKey: "diagnosis3",
      header: "Diagnosis 3",
    },
    // {
    //   accessorKey: "remarks",
    //   header: "Remarks",
    //   cell: ({ row }) => {
    //     const value = row.getValue("remarks") as string;
    //     return (
    //       <div className="max-w-[200px] truncate" title={value}>
    //         {value}
    //       </div>
    //     );
    //   }
    // },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("date") as Date;
        return format(date, "MMM dd, yyyy");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const diagnosis = row.original;

        return (
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => loadDiagnosis(Number(diagnosis.id))}
            >
              <span className="sr-only">Edit</span>
              <FilePenLine className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              onClick={() => handleDelete(Number(diagnosis.id))}
            >
              <span className="sr-only">Delete</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 grid grid-cols-1">
      <div className="bg-white rounded-sm">
        <div className="flex items-center justify-between p-3 pb-2 border-b">
          <div className="flex items-center">
            <Stethoscope className="mr-2 h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium">Doctor's Diagnosis</h3>
          </div>
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
            onClick={handleAddNewDiagnosis}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Diagnosis
          </Button>
        </div>

        {/* Diagnosis Table */}
        <div className="p-2">
          <DataTable
            columns={columns}
            data={diagnosisEntries}
            showGlobalFilter={false}
          />
        </div>
      </div>

      {/* Add/Edit Diagnosis Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {editingDiagnosis ? "Edit Diagnosis" : "Add New Diagnosis"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-4"
            >
              {/* First row with doctor name and date */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="doctorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Doctor Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Doctor"
                          value={`${user.firstName} ${user.lastName}`}
                          readOnly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Date
                      </FormLabel>
                      <FormControl>
                        <CustomDatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select date"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Medical history */}
              <div className="grid grid-cols-1 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="medicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Medical History & Examination
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter patient's medical history and examination notes"
                          className="resize-none h-20"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Diagnosis fields */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="diagnosis1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Diagnosis 1
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Primary diagnosis" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnosis2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Diagnosis 2
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Secondary diagnosis (optional)"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnosis3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Diagnosis 3
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Tertiary diagnosis (optional)"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Remarks */}
              <div className="grid grid-cols-1 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Remarks
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter any additional remarks or notes"
                          className="resize-none h-16"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Action buttons */}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  <Save className="mr-2 h-4 w-4" />
                  {editingDiagnosis ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this diagnosis record. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Doctor;
