import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserModel } from "@/types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { createEntity, updateEntity } from "@/api/mutation/entity.mutation";
import { CreateEntityDto } from "@/types/EntityDto";

interface EntityRegistrationFormProps {
  open: boolean;
  onClose: () => void;
  onEntityCreated?: (entity: UserModel) => void;
  existingEntity?: UserModel;
  isEditing?: boolean;
}

const entityTypes = [
  { value: "patient", label: "Patient" },
  { value: "nurse", label: "Nurse" },
  { value: "admin", label: "Admin" },
  { value: "finance", label: "Finance" },
  { value: "pharmacist", label: "Pharmacist" },
  { value: "doctor", label: "Doctor" },
  { value: "receptionist", label: "Receptionist" },
  { value: "pathologist", label: "Pathologist" },
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

type FormValues = z.infer<typeof formSchema>;

function EntityRegistrationForm({
  open,
  onClose,
  onEntityCreated,
  existingEntity,
  isEditing = false,
}: EntityRegistrationFormProps) {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Set default values based on whether we're editing an existing entity
  const defaultValues = {
    entityType: (existingEntity?.role || "patient") as "nurse" | "receptionist" | "patient" | "admin" | "finance" | "pathologist" | "pharmacist",
    firstName: existingEntity?.firstName || "",
    middleName: "",
    lastName: existingEntity?.lastName || "",
    phone: existingEntity?.phone || "",
    sex: "male" as const,
    idType: "national id" as const,
    idNumber: "",
    passportNumber: "",
    dob: new Date(),
    address: "",
    maritalStatus: "single" as const,
    email: existingEntity?.email || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleCloseSnackbar = () => {
    setShowSuccessMessage(false);
  };

  const onSubmit = async (data: FormValues) => {
    // Show loading state (optional)
    setShowSuccessMessage(false);
    
    try {
      // Prepare entity data for API
      const entityData: CreateEntityDto = {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dob: data.dob,
        sex: data.sex,
        entityTypeCode: data.entityType === 'patient' ? 'PAT' : 'STA', // Map the entity type to the code
        idType: data.idType,
        idNumber: data.idNumber,
        maritalStatus: data.maritalStatus,
        phone: data.phone,
        email: data.email,
        address: data.address,
      };
      
      let responseData;
      let entityId;
      
      // Use the appropriate mutation based on whether we're editing or creating
      if (isEditing && existingEntity) {
        entityId = existingEntity.id;
        // Update existing entity
        responseData = await updateEntity({
          ...entityData,
          entityNo: entityId,
        });
      } else {
        // Create new entity
        responseData = await createEntity(entityData);
        // Extract ID from response
        entityId = responseData.entityNo || `TEMP-${Date.now()}`;
      }
      
      // Create UserModel from response for UI updates
      const updatedEntity: UserModel = {
        id: entityId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || "",
        role: data.entityType,
        password: existingEntity?.password,
        department: existingEntity?.department,
        shift: existingEntity?.shift,
        username: existingEntity?.username || "",
      };
      
      // Show success message
      setSuccessMessage(isEditing ? "Entity updated successfully!" : "Entity created successfully!");
      setShowSuccessMessage(true);

      // Reset form
      form.reset();

      // Notify parent component that an entity was created/updated
      if (onEntityCreated) {
        onEntityCreated(updatedEntity);
      }

      // Close modal after a brief delay
      setTimeout(() => {
        onClose?.();

        // Navigate to entity details if it's a patient and not editing
        if (data.entityType === "patient" && !isEditing) {
          navigate(`/healthcare/registration/${entityId}`);
        }
      }, 1500);
      
    } catch (error) {
      console.error("Error saving entity:", error);
      // Show error message
      setSuccessMessage("Error saving entity. Please try again.");
      setShowSuccessMessage(true);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose?.()}>
        <DialogContent className="min-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">{isEditing ? 'Edit Entity' : 'Add New Entity'}</DialogTitle>
          </DialogHeader>

          <div className="p-3 pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <div className="flex items-end justify-end gap-2 mt-4">
                  <Button variant="outline" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Entity
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
}

export default EntityRegistrationForm;
