
import { useParams } from 'react-router-dom'
import { User, Calendar, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { consultations } from '@/data/data'
import { PatientModel, ConsultationModel } from '@/types'
import { useState, useEffect } from 'react'
import Triage from './stages/Triage'
import Doctor from './stages/Doctor'
import Prescription from './stages/Prescription'
import { Tab, Tabs } from '@mui/material'
import { Button } from '@/components/ui/button'
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
import Laboratory from './stages/Laboratory'


function TreatmentDate() {
    const { pk } = useParams()
    const [patient, setPatient] = useState<PatientModel | null>(null)
    const [consultation, setConsultation] = useState<ConsultationModel | null>(null)
    const [showNextConfirmDialog, setShowNextConfirmDialog] = useState(false);

    useEffect(() => {
        // Find the consultation with matching ID
        const found = consultations.find(c => c.id === pk)
        if (found) {
            setConsultation(found)
            setPatient(found.patient)
        }
    }, [pk])

    const [activeStep, setActiveStep] = useState(0);
    if (!consultation) {
        return <div>Consultation not found</div>;
    }


    // Define steps for the consultation process
    const steps = [
        {
            label: "Triage",
            component: <Triage patient={consultation.patient} />,
        },
        {
            label: "Doctor",
            component: <Doctor patient={consultation.patient} />,
        },
        {
            label: "Prescription",
            component: <Prescription patient={consultation.patient} />,
        },
        {
            label: "Laboratory",
            component: <Laboratory />,
        },
    ];

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

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
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

            {/* Patient Information */}
            <div className="mb-8">
                <div className="flex items-center border-b pb-2 mb-4">
                    <User className="text-primary mr-2 h-5 w-5" />
                    <h3 className="text-lg font-medium text-primary">
                        Patient Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="text-sm font-medium">
                            {patient ? `${patient.firstName || "N/A"} ${patient.lastName || ""}` : "N/A"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Date of Birth</p>
                        <p className="text-sm">
                            {patient?.dateOfBirth
                                ? format(new Date(patient.dateOfBirth), "MMM d, yyyy")
                                : "N/A"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm">{patient?.phone || "N/A"}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">{patient?.email || "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* Consultation Details */}
            <div className="mb-8">
                <div className="flex items-center border-b pb-2 mb-4">
                    <Calendar className="text-primary mr-2 h-5 w-5" />
                    <h3 className="text-lg font-medium text-primary">
                        Consultation Details
                    </h3>
                </div>

                <div className="">
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
                                label={
                                    <div>
                                        <p className='font-semibold'>
                                            {step.label}
                                        </p>
                                    </div>
                                }
                                id={`consultation-tab-${index}`}
                                aria-controls={`consultation-tabpanel-${index}`}
                            />
                        ))}
                    </Tabs>

                    {steps.map((step, index) => (
                        <TabPanel key={index} value={activeStep} index={index}>
                            {step.component}

                            {/* Navigation Controls */}
                            <div

                                className='flex pt-3 justify-between'
                            >
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={activeStep === 0}
                                >
                                    Back
                                </Button>

                                <Button
                                    color="primary"
                                    onClick={handleNext}
                                    disabled={activeStep === steps.length - 1}
                                >
                                    Continue
                                </Button>
                            </div>
                        </TabPanel>
                    ))}
                </div>

                {consultation?.notes && (
                    <div className="mt-4">
                        <div className="flex items-center mb-2">
                            <FileText className="text-muted-foreground mr-2 h-4 w-4" />
                            <p className="text-sm font-medium">Notes</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-md text-sm">
                            {consultation.notes}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


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
            {value === index && <div className='py-3'>{children}</div>}
        </div>
    );
}


export default TreatmentDate
