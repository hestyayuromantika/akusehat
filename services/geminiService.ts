import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Tool Definitions
const medicalRecordsTool: FunctionDeclaration = {
  name: "MedicalRecordsAgent",
  description: "Delegates to the Medical Records Agent to retrieve patient history, test results, or diagnosis.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query_type: {
        type: Type.STRING,
        description: "The specific type of record requested (e.g., 'lab_result', 'diagnosis', 'history', 'all')."
      },
      patient_context: {
        type: Type.STRING,
        description: "Summary of what the user is looking for regarding their records."
      }
    },
    required: ["query_type", "patient_context"]
  }
};

const billingTool: FunctionDeclaration = {
  name: "BillingAndInsuranceAgent",
  description: "Delegates to the Billing & Insurance Agent for invoices, payments, and coverage.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: {
        type: Type.STRING,
        description: "Action required: 'check_bill', 'pay_bill', 'insurance_policy'."
      },
      details: {
        type: Type.STRING,
        description: "Specific details about the billing inquiry."
      }
    },
    required: ["action"]
  }
};

const patientInfoTool: FunctionDeclaration = {
  name: "PatientInformationAgent",
  description: "Delegates to Patient Info Agent for registration, updates, or profile checks.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: {
        type: Type.STRING,
        description: "Action: 'register', 'update', 'view_profile'."
      },
      update_details: {
        type: Type.STRING,
        description: "If updating, what fields need changing."
      }
    },
    required: ["action"]
  }
};

const schedulerTool: FunctionDeclaration = {
  name: "AppointmentScheduler",
  description: "Delegates to Appointment Scheduler for booking, cancelling, or rescheduling.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      intent: {
        type: Type.STRING,
        description: "Intent: 'book', 'cancel', 'reschedule', 'check_availability'."
      },
      department: {
        type: Type.STRING,
        description: "Medical department (e.g., Cardiology, General, Neurology)."
      },
      date_time: {
        type: Type.STRING,
        description: "Requested date or time preference."
      }
    },
    required: ["intent"]
  }
};

const tools: Tool[] = [{
  functionDeclarations: [
    medicalRecordsTool,
    billingTool,
    patientInfoTool,
    schedulerTool
  ]
}];

export const sendMessageToNavigator = async (userMessage: string) => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
        temperature: 0.1, // Low temperature for precise routing
      }
    });

    return response;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw error;
  }
};
