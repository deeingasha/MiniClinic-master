import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HomeIcon, UserIcon, PhoneIcon } from "lucide-react";

const formSchema = z.object({
  fathersName: z.string().min(2, "Father's name must be at least 2 characters"),
  mothersName: z.string().min(2, "Mother's name must be at least 2 characters"),

  poBox: z.string().min(2, "PO Box must be at least 2 characters"),
  addressLine1: z
    .string()
    .min(2, "Address Line 1 must be at least 2 characters"),
  addressLine2: z
    .string()
    .min(2, "Address Line 2 must be at least 2 characters"),
  mobile1: z.string().min(2, "Mobile 1 must be at least 2 characters"),
  mobile2: z.string().min(2, "Mobile 2 must be at least 2 characters"),
  fax: z.string().min(2, "Fax must be at least 2 characters"),
  email: z.string().email("Invalid email address"),

  nextofKinName: z
    .string()
    .min(2, "Next of kin name must be at least 2 characters"),
  nextofKinMobile: z
    .string()
    .min(2, "Next of kin mobile must be at least 2 characters"),
  relationship: z.enum([
    "Father",
    "Mother",
    "Son",
    "Daughter",
    "Brother",
    "Sister",
    "Wife",
    "Husband",
    "Other",
  ]),
});

type FormData = z.infer<typeof formSchema>;

interface EntityDetailsProps {
  patient: PatientModel | undefined;
}

function EntityDetails({ patient = undefined }: EntityDetailsProps) {
  patient=patient;
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fathersName: "",
      mothersName: "",
      poBox: "",
      addressLine1: "",
      addressLine2: "",
      mobile1: "",
      mobile2: "",
      fax: "",
      email: "",
      nextofKinName: "",
      nextofKinMobile: "",
      relationship: "Other",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Form submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
          {/* Left column - Address Details */}
          <div className="bg-white rounded-sm">
            <div className="flex items-center p-3 pb-2 border-b">
              <HomeIcon className="mr-2 h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-medium">Address Details</h3>
            </div>
            <div className="p-3 pt-2">
            <div className="grid grid-cols-1 gap-2">
            <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="poBox"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">PO Box</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter PO Box"
                          {...field}
                          className=""
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Address Line 1</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter address line 1"
                          {...field}
                          className=""
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                </div>

                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Address Line 2</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter address line 2"
                          {...field}
                          className=""
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="mobile1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Mobile 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter mobile 1"
                            {...field}
                            className=""
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Mobile 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter mobile 2"
                            {...field}
                            className=""
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="fax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Fax</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter fax"
                            {...field}
                            className=""
                          />
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
                        <FormLabel className="text-xs">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email"
                            {...field}
                            className=""
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Parents and Next of Kin Details */}
          <div className="space-y-3">
            {/* Parents Details */}
            <div className="bg-white rounded-sm">
              <div className="flex items-center p-3 pb-2 border-b">
                <UserIcon className="mr-2 h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium">Parents Details</h3>
              </div>
              <div className="p-3 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="fathersName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Father's Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter father's name"
                            {...field}
                            className=""
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mothersName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Mother's Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter mother's name"
                            {...field}
                            className=""
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Next of Kin Details */}
            <div className="bg-white rounded-sm">
              <div className="flex items-center p-3 pb-2 border-b">
                <PhoneIcon className="mr-2 h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium">Next of Kin Details</h3>
              </div>
              <div className="p-3 pt-2">
                <div className="grid grid-cols-1 gap-2">
                  <FormField
                    control={form.control}
                    name="nextofKinName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Next of Kin Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter next of kin name"
                            {...field}
                            className=""
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="nextofKinMobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Next of Kin Mobile
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter next of kin mobile"
                              {...field}
                              className=""
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Relationship
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className=" w-full">
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Father">Father</SelectItem>
                              <SelectItem value="Mother">Mother</SelectItem>
                              <SelectItem value="Son">Son</SelectItem>
                              <SelectItem value="Daughter">Daughter</SelectItem>
                              <SelectItem value="Brother">Brother</SelectItem>
                              <SelectItem value="Sister">Sister</SelectItem>
                              <SelectItem value="Wife">Wife</SelectItem>
                              <SelectItem value="Husband">Husband</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default EntityDetails;
