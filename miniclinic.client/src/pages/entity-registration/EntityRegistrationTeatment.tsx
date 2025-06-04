import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tabs,
  Tab,
  Paper,
  CardContent,
  Card,
  Alert,
  AlertTitle,
  Snackbar,
  CircularProgress,
} from "@mui/material";
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
import EntityDetails from "./stages/EntityDetails";
import InsuranceDetails from "./stages/InsuranceDetails";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import TreatmentDate from "./stages/TreatmentDate";
import { PatientModel } from "@/types";
import { getEntityByNo } from "@/api/query/entity.query";
import { UpdateEntityDto } from "@/types/EntityDto";
import { updateEntity } from "@/api/mutation/entity.mutation";

type FormValues = z.infer<typeof formSchema>;

function TabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`consultation-tabpanel-${index}`}
      aria-labelledby={`consultation-tab-${index}`}
      {...other}
    >
      {value === index && <div className="py-1">{children}</div>}
    </div>
  );
}

const entityTypes = [
  { value: "patient", label: "Patient" },
  { value: "nurse", label: "Nurse" },
  { value: "admin", label: "Admin" },
  { value: "finance", label: "Finance" },
  { value: "pharmacist", label: "Pharmacist" },
  { value: "doctor", label: "Doctor" },
  { value: "receiptionist", label: "Receptionist" },
  { value: "parthologist", label: "Pathologist" },
];

const formSchema = z.object({
  entityType: z.enum([
    "nurse",
    "receptionist",
    "patient",
    "admin",
    "finance",
    "pathologist",
    "pharmacist",
  ]),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  sex: z.enum(["male", "female"]),
  idType: z.enum(["passport", "national id"]),
  idNumber: z.string().min(1, "ID number is required"),
  passportNumber: z.string().optional(),
  dob: z.date(),
  address: z.string().optional(),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
  email: z.string().email().optional(),
});

function EntityRegistrationTreatment() {
  const { pk } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<PatientModel | undefined>(undefined);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [showNextConfirmDialog, setShowNextConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form to update patient
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entityType: "patient" as const,
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      sex: "male" as const,
      idType: "national id" as const,
      idNumber: "",
      passportNumber: "",
      dob: new Date(),
      address: "",
      maritalStatus: "single" as const,
      email: "",
    },
  });

  // Load patient data from API
  useEffect(() => {
    if (pk) {
      setIsLoading(true);
      setError(null);

      const fetchEntityData = async () => {
        try {
          const entityData = await getEntityByNo(pk);

          // Transform EntityDto to PatientModel
          const transformedPatient: PatientModel = {
            id: entityData.entityNo || pk,
            firstName: entityData.fName,
            lastName: entityData.lName,
            phone: entityData.phone || '',
            email: entityData.email || '',
            sex: entityData.sex?.toLowerCase() as "male" | "female" || "male",
            idType: entityData.idType as "passport" | "national id" || "national id",
            idNumber: entityData.idNumber || '',
            passportNumber: '',
            dateOfBirth: entityData.dob ? new Date(entityData.dob) : new Date(),
            address: entityData.address || '',
            maritalStatus: entityData.maritalStatus as "single" | "married" | "divorced" | "widowed" || "single",
            createdAt: new Date(),
            updatedAt: new Date(),
            insurance: undefined,
            bloodPressure: undefined,
            height: undefined,
            weight: undefined,
            bmi: undefined
          };

          setPatient(transformedPatient);

          // Set form values from entity data
          form.reset({
            entityType: "patient",
            firstName: entityData.fName,
            middleName: entityData.mName || "",
            lastName: entityData.lName,
            phone: entityData.phone || "",
            sex: (entityData.sex?.toLowerCase() as "male" | "female") || "male",
            idType: (entityData.idType as "passport" | "national id") || "national id",
            idNumber: entityData.idNumber || "",
            passportNumber: "",
            dob: entityData.dob ? new Date(entityData.dob) : new Date(),
            address: entityData.address || "",
            maritalStatus: (entityData.maritalStatus as "single" | "married" | "divorced" | "widowed") || "single",
            email: entityData.email || "",
          });

          setIsLoading(false);
        } catch (err) {
          console.error('Error fetching entity:', err);
          setError('Failed to load entity data. Please try again later.');
          setIsLoading(false);
        }
      };

      fetchEntityData();
    } else {
      // If no patient ID (pk) is provided, redirect to another page
      navigate("/healthcare");
    }
  }, [pk, form, navigate]);

  // Handle form submission for updating patient
  const onSubmit = async (data: FormValues) => {
    if (patient && pk) {
      try {
        setIsLoading(true);

        // Prepare data for API
        const updateData = {
          entityNo: pk,
          fName: data.firstName,
          mName: data.middleName,
          lName: data.lastName,
          phone: data.phone,
          sex: data.sex,
          entityTypeCode: 'PAT', // Patient type
          idType: data.idType,
          idNumber: data.idNumber,
          dob: data.dob,
          address: data.address || '',
          maritalStatus: data.maritalStatus,
          email: data.email || '',
        };

        // Update entity via API
        await updateEntity(updateData as unknown as UpdateEntityDto);

        // Update local patient state with new data
        const updatedPatient = {
          ...patient,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          sex: data.sex,
          idType: data.idType,
          idNumber: data.idNumber,
          passportNumber: data.passportNumber,
          dateOfBirth: data.dob,
          address: data.address || "",
          maritalStatus: data.maritalStatus,
          email: data.email || "",
          updatedAt: new Date(),
        };

        setPatient(updatedPatient);

        // Show success message
        setSuccessMessage("Patient updated successfully!");
        setShowSuccessMessage(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error updating entity:', err);
        setSuccessMessage("Error updating patient. Please try again.");
        setShowSuccessMessage(true);
        setIsLoading(false);
      }
    }
  };

  const handleChangeStep = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setActiveStep(newValue);
  };

  const handleNext = () => {
    setShowNextConfirmDialog(true);
  };

  const confirmNext = () => {
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, steps.length - 1)
    );
    setShowNextConfirmDialog(false);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const steps = [
    {
      label: "Entity Details",
      component: <EntityDetails patient={patient} />,
    },
    {
      label: "Insurance Details",
      component: patient ? <InsuranceDetails patient={patient} /> : null,
    },
    {
      label: "Treatment Date",
      component: patient ? <TreatmentDate patient={patient} /> : null,
    },
  ];

  const handleCloseSnackbar = () => {
    setShowSuccessMessage(false);
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
        <span className="ml-2">Loading patient data...</span>
      </div>
    );
  }

  // If error occurred, display error message
  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }

  // If no patient exists, display a message and return
  if (!patient) {
    return (
      <Alert severity="info">
        <AlertTitle>Patient Not Found</AlertTitle>
        The requested patient does not exist or could not be loaded. Please select a valid patient.
      </Alert>
    );
  }

  return (
    <div>
      {/* Success Message */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          <AlertTitle>Success</AlertTitle>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Patient Update Form */}
      <div className="bg-white border rounded-sm mb-2 shadow-sm">
        <div className="border-b p-3 pb-2">
          <h2 className="text-lg font-medium">Update Entity</h2>
        </div>
        <div className="p-3 pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="grid grid-cols-1  sm:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="entityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entity Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select entity type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {entityTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Middle name" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email address"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value)
                                .toISOString()
                                .split("T")[0]
                              : ""
                          }
                          onChange={(e) => field.onChange(e.target.valueAsDate)}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="national id">
                            National ID
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="ID number" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Address" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-end justify-end">
                <Button type="submit" className="mt-2" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Patient"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Consultation Steps */}
      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
        {/* Tab Navigation */}
        <Paper
          square
          elevation={0}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tabs
            value={activeStep}
            onChange={handleChangeStep}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="consultation steps"
          >
            {steps.map((step, index) => (
              <Tab
                key={index}
                label={step.label}
                id={`consultation-tab-${index}`}
                aria-controls={`consultation-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Content Area */}
        <CardContent>
          {steps.map((step, index) => (
            <TabPanel key={index} value={activeStep} index={index}>
              {step.component}

              {/* Navigation Controls */}
              <div className="flex justify-between items-center border-t pt-2 mt-2 border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className="text-xs px-3"
                >
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={activeStep === steps.length - 1}
                  className="text-xs px-3"
                >
                  Continue
                </Button>

                {/* Confirmation Dialog */}
                <AlertDialog open={showNextConfirmDialog} onOpenChange={setShowNextConfirmDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to save and continue to the next step?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setShowNextConfirmDialog(false)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmNext}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabPanel>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default EntityRegistrationTreatment;
