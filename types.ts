export enum AgentType {
  NAVIGATOR = 'NAVIGATOR',
  MEDICAL_RECORDS = 'MedicalRecordsAgent',
  BILLING = 'BillingAndInsuranceAgent',
  PATIENT_INFO = 'PatientInformationAgent',
  SCHEDULER = 'AppointmentScheduler'
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  agent?: AgentType;
  timestamp: Date;
  isToolCall?: boolean;
}

export interface AgentState {
  activeAgent: AgentType;
  contextData: any; // Data passed to the sub-agent
  status: 'idle' | 'processing' | 'completed' | 'error';
}

// Mock data types for the agents
export interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  summary: string;
  doctor: string;
}

export interface Bill {
  id: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  service: string;
  insuranceCoverage: number;
}

export interface PatientProfile {
  name: string;
  dob: string;
  id: string;
  bloodType: string;
  allergies: string[];
}
