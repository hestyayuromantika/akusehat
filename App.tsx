import React, { useState, useRef, useEffect } from 'react';
import { Send, Activity, Info, Bot, User as UserIcon } from 'lucide-react';
import { sendMessageToNavigator } from './services/geminiService';
import { Message, AgentType, AgentState } from './types';
import { MedicalRecordsView, BillingView, PatientInfoView, AppointmentView } from './components/AgentViews';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello. I am the Hospital System Navigator. How can I assist you today? I can help with medical records, billing, patient information, or appointments.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentState, setAgentState] = useState<AgentState>({
    activeAgent: AgentType.NAVIGATOR,
    contextData: null,
    status: 'idle'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, agentState]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Reset agent state when new query starts, unless it's a follow-up inside an agent context? 
    // For this demo, we reset to show routing logic clearly.
    setAgentState({ activeAgent: AgentType.NAVIGATOR, contextData: null, status: 'processing' });

    try {
      const result = await sendMessageToNavigator(userMsg.content);
      
      const candidate = result.candidates?.[0];
      
      // Check for function calls
      const functionCalls = candidate?.content?.parts?.filter(part => part.functionCall);

      if (functionCalls && functionCalls.length > 0) {
        const fc = functionCalls[0].functionCall;
        if (!fc) return;

        console.log("Routing to Agent:", fc.name);
        
        let newAgent = AgentType.NAVIGATOR;
        let responseText = "";

        switch(fc.name) {
          case 'MedicalRecordsAgent':
            newAgent = AgentType.MEDICAL_RECORDS;
            responseText = "I am routing you to the Medical Records Agent to access those documents safely.";
            break;
          case 'BillingAndInsuranceAgent':
            newAgent = AgentType.BILLING;
            responseText = "Connecting you to the Billing & Insurance Department for assistance with your query.";
            break;
          case 'PatientInformationAgent':
            newAgent = AgentType.PATIENT_INFO;
            responseText = "Opening Patient Information System to manage details.";
            break;
          case 'AppointmentScheduler':
            newAgent = AgentType.SCHEDULER;
            responseText = "Delegating request to the Appointment Scheduler.";
            break;
          default:
            responseText = "I couldn't find the right agent.";
        }

        const systemMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: responseText,
          timestamp: new Date(),
          isToolCall: true
        };

        setMessages(prev => [...prev, systemMsg]);
        setAgentState({
          activeAgent: newAgent,
          contextData: fc.args,
          status: 'completed'
        });

      } else {
        // Fallback text if no tool was called (should rarely happen given instructions)
        const text = candidate?.content?.parts?.[0]?.text || "I apologize, could you clarify your request?";
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: text,
          timestamp: new Date()
        }]);
        setAgentState(prev => ({ ...prev, status: 'idle' }));
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "I encountered an error connecting to the central system. Please check your API Key configuration.",
        timestamp: new Date()
      }]);
      setAgentState(prev => ({ ...prev, status: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const renderActiveAgent = () => {
    switch (agentState.activeAgent) {
      case AgentType.MEDICAL_RECORDS:
        return <MedicalRecordsView contextData={agentState.contextData} />;
      case AgentType.BILLING:
        return <BillingView contextData={agentState.contextData} />;
      case AgentType.PATIENT_INFO:
        return <PatientInfoView contextData={agentState.contextData} />;
      case AgentType.SCHEDULER:
        return <AppointmentView contextData={agentState.contextData} />;
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
            <Activity size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-slate-600">System Idle</h3>
            <p className="max-w-xs mt-2">The navigator is waiting for your request to activate the appropriate hospital sub-system.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-slate-100">
      {/* Sidebar - Navigation / Branding */}
      <div className="hidden md:flex flex-col w-20 bg-slate-900 items-center py-6 gap-6 z-10">
        <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/50">
          <Activity className="text-white" size={28} />
        </div>
        <div className="flex-1 w-full flex flex-col items-center gap-4 mt-8">
           <button className={`p-3 rounded-lg transition-all ${agentState.activeAgent === AgentType.NAVIGATOR ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
             <Bot size={24} />
           </button>
           <div className="w-8 h-px bg-slate-800 my-2"></div>
           {/* Indicator Icons for Agents */}
           <div className={`p-2 rounded-lg transition-all ${agentState.activeAgent === AgentType.MEDICAL_RECORDS ? 'bg-slate-800 text-red-400' : 'text-slate-700'}`}>
              <Info size={20} />
           </div>
        </div>
        <div className="mb-4">
           <img src="https://picsum.photos/40/40" alt="User" className="rounded-full border-2 border-slate-700" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">
        
        {/* Chat Section */}
        <div className="flex-1 flex flex-col h-full md:max-w-lg bg-white border-r border-slate-200 z-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-sm sticky top-0 z-10">
            <div>
              <h1 className="font-bold text-slate-800 text-lg">Hospital Navigator</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                System Online
              </p>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600">
              v2.5 Flash
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.isToolCall && (
                    <div className="mt-2 text-xs flex items-center gap-1 opacity-70 border-t border-slate-300/50 pt-2">
                       <Activity size={12} /> Delegating Task...
                    </div>
                  )}
                </div>
              </div>
            ))}
             {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 rounded-tl-none flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-slate-400 ml-2">Identifying intent...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your request here (e.g., 'Book an appointment with cardiology')..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-600/20"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2">
              Protected Health Information (PHI) is handled by specific sub-agents.
            </p>
          </div>
        </div>

        {/* Dynamic Agent Workspace */}
        <div className="flex-1 bg-slate-50/50 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-center">
            {renderActiveAgent()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
