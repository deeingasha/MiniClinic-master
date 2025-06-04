import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Grid,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { PatientModel } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface PrescriptionProps {
  patient: PatientModel;
}

// Sample drug data - replace with actual API call
const availableDrugs = [
  {
    id: 1,
    name: "Amoxicillin",
    unit: "mg",
    stockQuantity: 200,
    unitPrice: 250,
    timesPerDayOptions: [1, 2, 3, 4],
    durationOptions: ["3 days", "5 days", "7 days", "10 days", "14 days"]
  },
  {
    id: 2,
    name: "Paracetamol",
    unit: "mg",
    stockQuantity: 500,
    unitPrice: 150,
    timesPerDayOptions: [1, 2, 3, 4, 6],
    durationOptions: ["3 days", "5 days", "7 days", "10 days", "14 days"]
  },
  {
    id: 3,
    name: "Aspirin",
    unit: "mg",
    stockQuantity: 300,
    unitPrice: 180,
    timesPerDayOptions: [1, 2],
    durationOptions: ["7 days", "14 days", "30 days"]
  },
  {
    id: 4,
    name: "Ibuprofen",
    unit: "mg",
    stockQuantity: 400,
    unitPrice: 200,
    timesPerDayOptions: [2, 3, 4],
    durationOptions: ["3 days", "5 days", "7 days", "10 days"]
  }
];

// Sample prescription history - replace with actual API call
const samplePrescriptionHistory = [
  {
    id: 1,
    date: "2025-03-15",
    doctor: "Dr. John Smith",
    drugs: [
      {
        id: 101,
        drugId: 1,
        drugName: "Amoxicillin",
        doses: "500",
        unit: "mg",
        timesPerDay: 3,
        duration: "7 days",
        remarks: "Take after meals",
        stockQuantity: 200,
        unitPrice: 250
      },
      {
        id: 102,
        drugId: 2,
        drugName: "Paracetamol",
        doses: "1000",
        unit: "mg",
        timesPerDay: 4,
        duration: "5 days",
        remarks: "Take as needed for pain",
        stockQuantity: 500,
        unitPrice: 150
      }
    ]
  },
  {
    id: 2,
    date: "2025-02-20",
    doctor: "Dr. Lisa Wilson",
    drugs: [
      {
        id: 201,
        drugId: 3,
        drugName: "Aspirin",
        doses: "100",
        unit: "mg",
        timesPerDay: 1,
        duration: "30 days",
        remarks: "Take with food",
        stockQuantity: 300,
        unitPrice: 180
      }
    ]
  },
  {
    id: 3,
    date: "2025-01-10",
    doctor: "Dr. Robert Johnson",
    drugs: [
      {
        id: 301,
        drugId: 4,
        drugName: "Ibuprofen",
        doses: "400",
        unit: "mg",
        timesPerDay: 3,
        duration: "7 days",
        remarks: "Take for inflammation",
        stockQuantity: 400,
        unitPrice: 200
      },
      {
        id: 302,
        drugId: 2,
        drugName: "Paracetamol",
        doses: "500",
        unit: "mg",
        timesPerDay: 3,
        duration: "5 days",
        remarks: "Take for fever",
        stockQuantity: 500,
        unitPrice: 150
      }
    ]
  }
];

// Define the prescribed drug interface
interface PrescribedDrug {
  id: number;
  drugId: number;
  drugName: string;
  doses: string;
  unit: string;
  timesPerDay: number | string;
  duration: string;
  remarks: string;
  stockQuantity: number;
  unitPrice: number;
}

interface PrescriptionHistory {
  id: number;
  date: string;
  doctor: string;
  drugs: PrescribedDrug[];
}

function Prescription({ patient }: PrescriptionProps) {
  const [selectedDrug, setSelectedDrug] = useState<number | "">("");
  const [prescribedDrugs, setPrescribedDrugs] = useState<PrescribedDrug[]>([]);
  const [prescriptionHistory, setPrescriptionHistory] = useState<PrescriptionHistory[]>([]);
  const [currentDoctor, setCurrentDoctor] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrescriptionId, setEditingPrescriptionId] = useState<number | null>(null);

  // Fetch prescription history on component mount
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // based on the patient ID
    setPrescriptionHistory(samplePrescriptionHistory);

    // Set current doctor - in a real app, this would come from auth context or API
    setCurrentDoctor("Dr. Lisa Wilson");
  }, [patient]);

  const handleDrugChange = (value: string) => {
    setSelectedDrug(value ? Number(value) : "");
  };

  const handleOpenNewPrescriptionModal = () => {
    // Clear any previously selected drugs
    setPrescribedDrugs([]);
    setEditingPrescriptionId(null);
    setIsModalOpen(true);
  };

  const handleEditPrescription = (prescriptionId: number) => {
    const prescription = prescriptionHistory.find(p => p.id === prescriptionId);
    if (prescription) {
      // Load the prescription drugs into the form
      setPrescribedDrugs(prescription.drugs);
      setEditingPrescriptionId(prescriptionId);
      setIsModalOpen(true);
    }
  };

  const addDrugToPrescription = () => {
    if (!selectedDrug) return;

    const drugToAdd = availableDrugs.find(drug => drug.id === selectedDrug);
    if (!drugToAdd) return;

    // Check if drug is already in the prescription
    if (prescribedDrugs.some(drug => drug.drugId === selectedDrug)) {
      alert("This drug is already in the prescription.");
      return;
    }

    // Add drug to prescription
    setPrescribedDrugs(prev => [
      ...prev,
      {
        id: Date.now(),
        drugId: drugToAdd.id,
        drugName: drugToAdd.name,
        doses: "",
        unit: drugToAdd.unit,
        timesPerDay: "",
        duration: "",
        remarks: "",
        stockQuantity: drugToAdd.stockQuantity,
        unitPrice: drugToAdd.unitPrice
      }
    ]);

    // Reset selection
    setSelectedDrug("");
  };

  const handleDrugRemove = (id: number) => {
    setPrescribedDrugs(prev => prev.filter(drug => drug.id !== id));
  };

  const handleFieldChange = (
    id: number,
    field: keyof Omit<PrescribedDrug, "id" | "drugId" | "drugName" | "unit" | "stockQuantity" | "unitPrice">,
    value: string | number
  ) => {
    setPrescribedDrugs(prev =>
      prev.map(drug =>
        drug.id === id ? { ...drug, [field]: value } : drug
      )
    );
  };

  const handlePrescribe = () => {
    // Check if prescription is empty
    if (prescribedDrugs.length === 0) {
      alert("Please add at least one drug to the prescription.");
      return;
    }

    // Check if all required fields are filled
    const missingFields = prescribedDrugs.some(drug =>
      !drug.doses || !drug.timesPerDay || !drug.duration
    );

    if (missingFields) {
      alert("Please fill all required fields for all drugs in the prescription.");
      return;
    }

    // In a real app, you would send the prescription to your API
    // and handle the response

    if (editingPrescriptionId) {
      // Update existing prescription
      setPrescriptionHistory(prev =>
        prev.map(p => {
          if (p.id === editingPrescriptionId) {
            return {
              ...p,
              drugs: prescribedDrugs,
              date: new Date().toISOString().split('T')[0] // Today's date
            };
          }
          return p;
        })
      );
    } else {
      // Create new prescription
      const newPrescription: PrescriptionHistory = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0], // Today's date
        doctor: currentDoctor,
        drugs: prescribedDrugs
      };

      setPrescriptionHistory(prev => [...prev, newPrescription]);
    }

    alert("Prescription submitted successfully!");

    // Close modal and reset form
    setIsModalOpen(false);
    setPrescribedDrugs([]);
    setEditingPrescriptionId(null);
  };

  const getTimesPerDayOptions = (drugId: number) => {
    const drug = availableDrugs.find(d => d.id === drugId);
    return drug ? drug.timesPerDayOptions : [];
  };

  const getDurationOptions = (drugId: number) => {
    const drug = availableDrugs.find(d => d.id === drugId);
    return drug ? drug.durationOptions : [];
  };

//


  return (
    <Box>
      <Card elevation={0}>
        <CardHeader
          title="Prescription History"
          subheader="View all prescriptions for this patient"
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenNewPrescriptionModal}
            >
              New Prescription
            </Button>
          }
        />
        <Divider />
        <CardContent>
          {prescriptionHistory.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No prescription history found for this patient.
            </Alert>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="160px">Date</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Medications</TableCell>
                    <TableCell width="100px" align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prescriptionHistory.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell>{prescription.date}</TableCell>
                      <TableCell>{prescription.doctor}</TableCell>
                      <TableCell>
                        {prescription.drugs.map(drug => (
                          <div key={drug.id} style={{ marginBottom: '4px' }}>
                            <Typography variant="body2" component="span">
                              {drug.drugName}: {drug.doses} {drug.unit}, {drug.timesPerDay}x daily, {drug.duration}
                            </Typography>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditPrescription(prescription.id)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Prescription Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="min-w-5xl">
          <DialogHeader>
            <DialogTitle>
              {editingPrescriptionId ? "Edit Prescription" : "Create New Prescription"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Card elevation={0}  sx={{ mb: 3 }}>
              <CardHeader
                title="Add Medications"
                subheader={`Doctor: ${currentDoctor}`}
                sx={{ pb: 1 }}
              />
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12}}>
                    <Box sx={{ mb: 0 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Select Medication
                      </Typography>
                      <Select
                        value={selectedDrug.toString()}
                        onValueChange={handleDrugChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a medication" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDrugs.map((drug) => (
                            <SelectItem
                              key={drug.id}
                              value={drug.id.toString()}
                            >
                              {drug.name} ({drug.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addDrugToPrescription}
                      disabled={!selectedDrug}
                      fullWidth
                    >
                      Add to Prescription
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card elevation={0}>
              <CardHeader title="Prescription Details" sx={{ pb: 1 }} />
              <CardContent>
                {prescribedDrugs.length === 0 ? (
                  <Alert severity="info">
                    No medications added to the prescription yet.
                  </Alert>
                ) : (
                  <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Medication</TableCell>
                          <TableCell>Dosage</TableCell>
                          <TableCell>Times/Day</TableCell>
                          <TableCell>Duration</TableCell>
                          <TableCell>DOA</TableCell>
                          <TableCell>Remarks</TableCell>
                          <TableCell>Stock</TableCell>
                          <TableCell>Unit Price</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {prescribedDrugs.map((drug) => (
                          <TableRow key={drug.id}>
                            <TableCell>{drug.drugName}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Input
                                  className="w-20 mr-2"
                                  value={drug.doses}
                                  onChange={(e) =>
                                    handleFieldChange(drug.id, "doses", e.target.value)
                                  }
                                  placeholder="Dosage"
                                />
                                <Typography variant="body2">{drug.unit}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={drug.timesPerDay ? drug.timesPerDay.toString() : ""}
                                onValueChange={(value) =>
                                  handleFieldChange(drug.id, "timesPerDay", Number(value))
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue placeholder="Times/day" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getTimesPerDayOptions(drug.drugId).map((option) => (
                                    <SelectItem key={option} value={option.toString()}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={drug.duration}
                                onValueChange={(value) =>
                                  handleFieldChange(drug.id, "duration", value)
                                }
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue placeholder="Duration" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getDurationOptions(drug.drugId).map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={drug.timesPerDay ? drug.timesPerDay.toString() : ""}
                                onValueChange={(value) =>
                                  handleFieldChange(drug.id, "timesPerDay", Number(value))
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue placeholder="Times/day" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getTimesPerDayOptions(drug.drugId).map((option) => (
                                    <SelectItem key={option} value={option.toString()}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                className="w-full"
                                value={drug.remarks}
                                onChange={(e) =>
                                  handleFieldChange(drug.id, "remarks", e.target.value)
                                }
                                placeholder="Special instructions"
                              />
                            </TableCell>
                            <TableCell>{drug.stockQuantity}</TableCell>
                            <TableCell>Ksh.{drug.unitPrice}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                color="error"
                                onClick={() => handleDrugRemove(drug.id)}
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {/* {prescribedDrugs.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={5} align="right">
                              <Typography variant="subtitle1" fontWeight="bold">
                                Total Cost:
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Typography variant="subtitle1" fontWeight="bold">
                                Ksh.{calculateTotal().toFixed(2)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )} */}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button
              variant="outlined"
              onClick={() => setIsModalOpen(false)}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrescribe}
              disabled={prescribedDrugs.length === 0}
            >
              {editingPrescriptionId ? "Update Prescription" : "Save Prescription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Prescription;
