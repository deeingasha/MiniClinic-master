import { useState, useEffect } from "react";
import { PatientModel } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save, Trash2, Edit } from "lucide-react";

// Sample insurance schemes
const insuranceSchemes = [
  { id: 1, name: "NHIF" },
  { id: 2, name: "Private Insurance" },
  { id: 3, name: "Corporate" },
];

// Sample insurances by scheme
const sampleInsurancesByScheme: Record<string, { id: number; name: string }[]> = {
  "1": [{ id: 101, name: "Standard NHIF" }],
  "2": [
    { id: 201, name: "Jubilee" },
    { id: 202, name: "AAR" },
    { id: 203, name: "Britam" },
  ],
  "3": [
    { id: 301, name: "Company A" },
    { id: 302, name: "Company B" },
  ],
};

/**
 * Define the insurance detail interface
 */
interface InsuranceDetail {
  id: number;
  insuranceName: string;
  principalNo: string;
  nhifId: string;
  principalName: string;
  relationship: string;
  isEditing: boolean;
  isNew: boolean;
}

interface InsuranceDetailsProps {
  patient: PatientModel | undefined;
}

function InsuranceDetails({ patient = undefined }: InsuranceDetailsProps) {
  console.log(patient);
  
  const [selectedScheme, setSelectedScheme] = useState<string>("");
  const [selectedInsurance, setSelectedInsurance] = useState<string>("");
  const [insuranceDetails, setInsuranceDetails] = useState<InsuranceDetail[]>([]);
  const [insurances, setInsurances] = useState<{ id: number; name: string }[]>([]);
  const [newInsuranceDetail, setNewInsuranceDetail] = useState<InsuranceDetail>({
    id: 0,
    insuranceName: "",
    principalNo: "",
    nhifId: "",
    principalName: "",
    relationship: "",
    isEditing: false,
    isNew: true,
  });

  // Load insurances when scheme changes
  useEffect(() => {
    if (selectedScheme) {
      setInsurances(sampleInsurancesByScheme[selectedScheme] || []);
      setSelectedInsurance("");
    } else {
      setInsurances([]);
      setSelectedInsurance("");
    }
  }, [selectedScheme]);

  // Initialize with sample data
  useEffect(() => {
    // In a real app, you would fetch this from an API
    setInsuranceDetails([
      {
        id: 1,
        insuranceName: "Jubilee",
        principalNo: "JUB123456",
        nhifId: "NHIF-001",
        principalName: "John Doe",
        relationship: "Self",
        isEditing: false,
        isNew: false,
      },
    ]);
  }, []);

  const handleSchemeChange = (value: string) => {
    setSelectedScheme(value);
  };

  const handleInsuranceChange = (value: string) => {
    setSelectedInsurance(value);
    if (value) {
      const insurance = insurances.find(
        (ins) => ins.id === parseInt(value, 10)
      );
      if (insurance) {
        setNewInsuranceDetail((prev) => ({
          ...prev,
          insuranceName: insurance.name,
        }));
      }
    }
  };

  const handleDetailChange = (field: keyof InsuranceDetail, value: string) => {
    setNewInsuranceDetail((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdd = () => {
    if (!newInsuranceDetail.insuranceName || !newInsuranceDetail.principalNo) {
      alert("Please fill all required fields");
      return;
    }

    const newId =
      insuranceDetails.length > 0
        ? Math.max(...insuranceDetails.map((d) => d.id)) + 1
        : 1;

    const updatedDetail = {
      ...newInsuranceDetail,
      id: newId,
      isNew: false,
      isEditing: false,
    };

    setInsuranceDetails((prev) => [...prev, updatedDetail]);
    setNewInsuranceDetail({
      id: 0,
      insuranceName: "",
      principalNo: "",
      nhifId: "",
      principalName: "",
      relationship: "",
      isEditing: false,
      isNew: true,
    });
    setSelectedScheme("");
    setSelectedInsurance("");
  };

  const handleEditToggle = (id: number) => {
    setInsuranceDetails((prev) =>
      prev.map((detail) =>
        detail.id === id
          ? { ...detail, isEditing: !detail.isEditing }
          : detail
      )
    );
  };

  const handleUpdate = (detail: InsuranceDetail) => {
    setInsuranceDetails((prev) =>
      prev.map((d) =>
        d.id === detail.id ? { ...detail, isEditing: false } : d
      )
    );
  };

  const handleDelete = (id: number) => {
    setInsuranceDetails((prev) => prev.filter((detail) => detail.id !== id));
  };

  const handleFieldChange = (
    id: number,
    field: keyof InsuranceDetail,
    value: string
  ) => {
    setInsuranceDetails((prev) =>
      prev.map((detail) =>
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    );
  };

  return (
    <div className="space-y-3 mt-2">
      {/* Add Insurance Section */}
      <div className="bg-white border rounded-sm shadow-sm">
        <div className="border-b p-3 pb-2">
          <h3 className="text-sm font-medium flex items-center">
            <PlusCircle className="w-4 h-4 mr-2 text-blue-500" />
            Add Insurance
          </h3>
        </div>

        <div className="p-3 pt-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs block mb-1">Scheme</label>
              <Select
                value={selectedScheme}
                onValueChange={handleSchemeChange}
              >
                <SelectTrigger className=" w-full">
                  <SelectValue placeholder="Select scheme" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceSchemes.map((scheme) => (
                    <SelectItem key={scheme.id} value={scheme.id.toString()}>
                      {scheme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs block mb-1">Insurance</label>
              <Select
                value={selectedInsurance}
                onValueChange={handleInsuranceChange}
                disabled={!selectedScheme}
              >
                <SelectTrigger className=" w-full">
                  <SelectValue placeholder="Select insurance" />
                </SelectTrigger>
                <SelectContent>
                  {insurances.map((insurance) => (
                    <SelectItem key={insurance.id} value={insurance.id.toString()}>
                      {insurance.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs block mb-1">Principal Number</label>
              <Input
                className=""
                placeholder="Enter principal number"
                value={newInsuranceDetail.principalNo}
                onChange={(e) => handleDetailChange("principalNo", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="text-xs block mb-1">NHIF ID</label>
              <Input
                className=""
                placeholder="Enter NHIF ID"
                value={newInsuranceDetail.nhifId}
                onChange={(e) => handleDetailChange("nhifId", e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs block mb-1">Principal Name</label>
              <Input
                className=""
                placeholder="Enter principal name"
                value={newInsuranceDetail.principalName}
                onChange={(e) => handleDetailChange("principalName", e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs block mb-1">Relationship</label>
              <Select
                value={newInsuranceDetail.relationship}
                onValueChange={(value) => handleDetailChange("relationship", value)}
              >
                <SelectTrigger className=" w-full">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Self">Self</SelectItem>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              onClick={handleAdd}
              className=" text-xs"
              disabled={!newInsuranceDetail.insuranceName || !newInsuranceDetail.principalNo}
            >
              <PlusCircle className="w-3 h-3 mr-1" />
              Add Insurance
            </Button>
          </div>
        </div>
      </div>

      {/* Insurance Details Table */}
      <div className="bg-white border rounded-sm shadow-sm">
        <div className="border-b p-3 pb-2">
          <h3 className="text-sm font-medium">Insurance Details</h3>
        </div>

        <div className="p-0">
          {insuranceDetails.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Insurance</th>
                    <th className="px-3 py-2 text-left font-medium">Principal #</th>
                    <th className="px-3 py-2 text-left font-medium">NHIF ID</th>
                    <th className="px-3 py-2 text-left font-medium">Principal Name</th>
                    <th className="px-3 py-2 text-left font-medium">Relationship</th>
                    <th className="px-3 py-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {insuranceDetails.map((detail) => (
                    <tr key={detail.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-left">
                        {detail.isEditing ? (
                          <Input
                            className="h-7"
                            value={detail.insuranceName}
                            onChange={(e) =>
                              handleFieldChange(
                                detail.id,
                                "insuranceName",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          detail.insuranceName
                        )}
                      </td>
                      <td className="px-3 py-2 text-left">
                        {detail.isEditing ? (
                          <Input
                            className="h-7"
                            value={detail.principalNo}
                            onChange={(e) =>
                              handleFieldChange(
                                detail.id,
                                "principalNo",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          detail.principalNo
                        )}
                      </td>
                      <td className="px-3 py-2 text-left">
                        {detail.isEditing ? (
                          <Input
                            className="h-7"
                            value={detail.nhifId}
                            onChange={(e) =>
                              handleFieldChange(
                                detail.id,
                                "nhifId",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          detail.nhifId
                        )}
                      </td>
                      <td className="px-3 py-2 text-left">
                        {detail.isEditing ? (
                          <Input
                            className="h-7"
                            value={detail.principalName}
                            onChange={(e) =>
                              handleFieldChange(
                                detail.id,
                                "principalName",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          detail.principalName
                        )}
                      </td>
                      <td className="px-3 py-2 text-left">
                        {detail.isEditing ? (
                          <Select
                            value={detail.relationship}
                            onValueChange={(value) =>
                              handleFieldChange(
                                detail.id,
                                "relationship",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="h-7 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Self">Self</SelectItem>
                              <SelectItem value="Spouse">Spouse</SelectItem>
                              <SelectItem value="Child">Child</SelectItem>
                              <SelectItem value="Parent">Parent</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          detail.relationship
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {detail.isEditing ? (
                          <Button
                            onClick={() => handleUpdate(detail)}
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleEditToggle(detail.id)}
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDelete(detail.id)}
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No insurance details found. Add insurance details above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsuranceDetails;
