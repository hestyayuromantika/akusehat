import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, User, Calendar, CheckCircle, Download, Activity, ShieldAlert, Clock } from 'lucide-react';
import { AgentType } from '../types';

interface AgentViewProps {
  contextData: any;
  onClose?: () => void;
}

// --- Medical Records Agent View ---
export const MedicalRecordsView: React.FC<AgentViewProps> = ({ contextData }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Medical Records Agent</h2>
          <p className="text-sm text-slate-500">Confidential Patient Data Access</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldAlert className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                Access Logged: HIPAA Compliance Active. Retrieving records related to: <span className="font-semibold">{contextData?.query_type || 'General History'}</span>
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-6">Generated Documents</h3>
        
        <div className="grid gap-3">
          {[
            { name: 'Lab Results - Blood Panel.pdf', date: 'Oct 24, 2023', type: 'PDF' },
            { name: 'Cardiology Consultation Note.docx', date: 'Sep 12, 2023', type: 'DOCX' },
            { name: 'Discharge Summary.pdf', date: 'Aug 05, 2023', type: 'PDF' },
          ].map((file, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-red-200 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="text-slate-400" size={20} />
                <div>
                  <p className="font-medium text-slate-700">{file.name}</p>
                  <p className="text-xs text-slate-500">{file.date} • {file.type}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Billing Agent View ---
export const BillingView: React.FC<AgentViewProps> = ({ contextData }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
       <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
          <DollarSign size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Billing & Insurance</h2>
          <p className="text-sm text-slate-500">Financial Services Department</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
          <p className="text-emerald-600 text-sm font-medium">Outstanding Balance</p>
          <p className="text-2xl font-bold text-emerald-800">$1,240.00</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Insurance Status</p>
          <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" /> Active
          </p>
          <p className="text-xs text-slate-400">Policy: H-992-X (BlueCross)</p>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Invoices</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 border-b border-slate-100">
          <div>
             <p className="font-medium text-slate-700">Emergency Room Visit</p>
             <p className="text-xs text-slate-500">Oct 20, 2023</p>
          </div>
          <span className="text-slate-900 font-bold">$450.00</span>
        </div>
        <div className="flex justify-between items-center p-3 border-b border-slate-100">
          <div>
             <p className="font-medium text-slate-700">MRI Scan (Head)</p>
             <p className="text-xs text-slate-500">Sep 10, 2023</p>
          </div>
          <span className="text-slate-900 font-bold">$790.00</span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-100">
        <button className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors shadow-sm">
          Pay Outstanding Balance
        </button>
      </div>
    </div>
  );
};

// --- Patient Info Agent View ---
export const PatientInfoView: React.FC<AgentViewProps> = ({ contextData }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
       <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Patient Information</h2>
          <p className="text-sm text-slate-500">Administration & Records</p>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="h-20 w-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-3">
           <User size={40} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">John Doe</h3>
        <p className="text-sm text-slate-500">ID: P-99281 • DOB: 12/04/1985</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border border-slate-200 rounded-lg">
             <label className="text-xs text-slate-400 block mb-1">Phone</label>
             <p className="text-slate-700 font-medium">+1 (555) 123-4567</p>
          </div>
          <div className="p-3 border border-slate-200 rounded-lg">
             <label className="text-xs text-slate-400 block mb-1">Email</label>
             <p className="text-slate-700 font-medium">j.doe@example.com</p>
          </div>
           <div className="p-3 border border-slate-200 rounded-lg">
             <label className="text-xs text-slate-400 block mb-1">Emergency Contact</label>
             <p className="text-slate-700 font-medium">Jane Doe (Wife)</p>
          </div>
           <div className="p-3 border border-slate-200 rounded-lg">
             <label className="text-xs text-slate-400 block mb-1">Blood Type</label>
             <p className="text-slate-700 font-medium">O+</p>
          </div>
        </div>

        {contextData?.action === 'update' && (
           <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 mt-4">
             <p className="font-semibold">Update Requested:</p>
             <p>{contextData.update_details || 'General profile update initiated.'}</p>
             <button className="mt-2 text-blue-600 underline hover:text-blue-800">Confirm Changes</button>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Appointment Scheduler Agent View ---
export const AppointmentView: React.FC<AgentViewProps> = ({ contextData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-64 flex flex-col items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
         <p className="text-slate-500">Checking specialist availability...</p>
       </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
       <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
          <Calendar size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Appointment Scheduler</h2>
          <p className="text-sm text-slate-500">Central Scheduling</p>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-indigo-900 mb-1">Request Summary</h4>
        <p className="text-sm text-indigo-700">
          {contextData?.intent === 'book' ? 'New Booking' : 'Modification'} • {contextData?.department || 'General Practice'}
        </p>
        {contextData?.date_time && (
          <p className="text-sm text-indigo-600 mt-1 flex items-center gap-1">
             <Clock size={14} /> Preference: {contextData.date_time}
          </p>
        )}
      </div>

      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Available Slots</h3>
      <div className="grid grid-cols-1 gap-2">
        {['Mon, Oct 30 - 09:00 AM', 'Mon, Oct 30 - 02:30 PM', 'Tue, Oct 31 - 10:15 AM'].map((slot, i) => (
          <button key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left">
            <span className="font-medium text-slate-700 group-hover:text-indigo-900">{slot}</span>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded group-hover:bg-indigo-200 group-hover:text-indigo-700">Dr. Smith</span>
          </button>
        ))}
      </div>
    </div>
  );
};
