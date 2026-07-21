import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Mail, Phone, Trash2, X, CheckSquare, MessageSquare, ExternalLink, Calendar, RefreshCcw, Filter } from 'lucide-react';
import { fetchInquiriesApi, updateInquiryStatusApi, deleteInquiryApi, ApiInquiry } from '../services/api';

export default function AdminLeadsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [leads, setLeads] = useState<ApiInquiry[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'enrollment' | 'contact' | 'registration'>('all');
  const [latestEmailLogs, setLatestEmailLogs] = useState<{
    clientEmail: any;
    studentEmail: any;
  } | null>(null);

  const loadLeads = async () => {
    const data = await fetchInquiriesApi();
    setLeads(data);
  };

  useEffect(() => {
    loadLeads();

    // Check query parameters to auto-open drawer
    const params = new URLSearchParams(window.location.search);
    if (params.get('leads') === 'true' || params.get('admin') === 'true') {
      setIsOpen(true);
    }

    // Listen to lead updates
    window.addEventListener('dcode_leads_updated', loadLeads);
    
    // Listen to email dispatches
    const handleEmailDispatch = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setLatestEmailLogs(customEvent.detail);
      }
    };
    window.addEventListener('dcode_email_dispatched', handleEmailDispatch);

    return () => {
      window.removeEventListener('dcode_leads_updated', loadLeads);
      window.removeEventListener('dcode_email_dispatched', handleEmailDispatch);
    };
  }, []);

  const handleDelete = async (id: string) => {
    await deleteInquiryApi(id);
    loadLeads();
  };

  const handleStatusChange = async (id: string, status: 'New' | 'Contacted' | 'Enrolled') => {
    await updateInquiryStatusApi(id, status);
    loadLeads();
  };

  const filteredLeads = leads.filter(item => {
    if (activeFilter === 'all') return true;
    return item.formType === activeFilter;
  });

  return (
    <>
      {/* Trigger Button on Bottom-Left */}
      <div className="fixed bottom-6 left-6 z-45">
        <button
          onClick={() => {
            loadLeads();
            setIsOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D2C54] hover:bg-[#D31218] text-white border border-white/10 rounded-full font-space text-[10px] uppercase tracking-wider font-bold shadow-lg cursor-pointer transition-all active:scale-95"
          title="Verify stored inquiries & email logs"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          Leads DB Portal
          <span className="w-4 h-4 rounded-full bg-[#D31218] text-white text-[9px] flex items-center justify-center font-bold">
            {leads.length}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
            {/* Backdrop close */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col justify-between overflow-hidden border-l border-[#0D2C54]/10 z-10"
            >
              {/* Header */}
              <div className="p-5 bg-[#0D2C54] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Lead Database Explorer
                    </h3>
                    <p className="font-space text-[10px] text-gray-300 uppercase tracking-widest">
                      SQLite DB Persistence • Nodemailer API Logs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
                
                {/* Email Dispatcher Log Box */}
                <div className="bg-white border border-[#D31218]/10 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-4 h-4 text-[#D31218]" />
                    <h4 className="font-serif text-sm font-bold text-[#0D2C54]">
                      Nodemailer / Resend Dispatcher Logs
                    </h4>
                    <span className="font-space text-[9px] bg-[#D31218]/10 text-[#D31218] py-0.5 px-2 rounded-full uppercase font-bold">
                      Real-time Sync
                    </span>
                  </div>

                  {latestEmailLogs ? (
                    <div className="space-y-4">
                      {/* Log 1: Academy Admin Notification */}
                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs space-y-2">
                        <div className="flex items-center justify-between text-gray-500 font-mono text-[10px]">
                          <span>DISPATCHED TO OWNER EMAIL</span>
                          <span>{latestEmailLogs.clientEmail.to}</span>
                        </div>
                        <p className="font-semibold text-[#0D2C54]">{latestEmailLogs.clientEmail.subject}</p>
                        <div className="bg-white p-2 rounded border border-gray-100 max-h-24 overflow-y-auto text-[10px] text-gray-600 font-sans" 
                             dangerouslySetInnerHTML={{ __html: latestEmailLogs.clientEmail.body }} />
                      </div>

                      {/* Log 2: Student Confirmation */}
                      {latestEmailLogs.studentEmail ? (
                        <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs space-y-2">
                          <div className="flex items-center justify-between text-emerald-600 font-mono text-[10px]">
                            <span>DISPATCHED TO STUDENT</span>
                            <span>{latestEmailLogs.studentEmail.to}</span>
                          </div>
                          <p className="font-semibold text-emerald-800">{latestEmailLogs.studentEmail.subject}</p>
                          <div className="bg-white p-2 rounded border border-emerald-100 max-h-24 overflow-y-auto text-[10px] text-gray-600 font-sans"
                               dangerouslySetInnerHTML={{ __html: latestEmailLogs.studentEmail.body }} />
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-400 italic">
                          No student confirmation email dispatched (email address was not provided in input form).
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-[#F8FAFC] rounded-lg text-center border border-dashed border-gray-200">
                      <p className="font-sans text-xs text-gray-400">
                        Submit any form (Enrollment, Contact, or Registration) to see instant Nodemailer dispatch triggers!
                      </p>
                    </div>
                  )}
                </div>

                {/* Form Type Filter Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
                  <div className="flex items-center gap-1 text-xs font-space font-bold text-[#0D2C54] uppercase">
                    <Filter className="w-3.5 h-3.5 text-[#D31218]" /> Filter:
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { key: 'all', label: 'All Forms' },
                      { key: 'enrollment', label: 'Enrollments' },
                      { key: 'contact', label: 'Contact Forms' },
                      { key: 'registration', label: 'Registrations' }
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveFilter(tab.key as any)}
                        className={`text-[10px] font-space px-2.5 py-1 rounded-md font-bold uppercase transition-all cursor-pointer ${
                          activeFilter === tab.key
                            ? 'bg-[#0D2C54] text-white shadow-xs'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stored Leads Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-[#0D2C54]">
                      Database Entries ({filteredLeads.length})
                    </h4>
                    <button
                      onClick={loadLeads}
                      className="text-[10px] font-space uppercase text-[#D31218] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCcw className="w-3 h-3" /> Refresh DB
                    </button>
                  </div>

                  {filteredLeads.length > 0 ? (
                    <div className="space-y-3">
                      {filteredLeads.map((lead) => (
                        <div key={lead.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-xs space-y-3">
                          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-50 pb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-serif text-sm font-extrabold text-[#0D2C54]">{lead.fullName}</p>
                                <span className={`text-[9px] font-space font-bold uppercase px-2 py-0.5 rounded ${
                                  lead.formType === 'enrollment' ? 'bg-blue-100 text-blue-800' :
                                  lead.formType === 'registration' ? 'bg-purple-100 text-purple-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {lead.formType}
                                </span>
                              </div>
                              <p className="font-space text-[9px] text-gray-400 uppercase">{lead.id} • {new Date(lead.createdAt).toLocaleString()}</p>
                            </div>
                            
                            {/* Status Badges Selector */}
                            <div className="flex items-center gap-1">
                              {(['New', 'Contacted', 'Enrolled'] as const).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleStatusChange(lead.id, st)}
                                  className={`text-[9px] font-space px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                                    lead.status === st
                                      ? st === 'New' ? 'bg-[#D31218]/15 text-[#D31218]' : st === 'Contacted' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <a href={`tel:${lead.phone}`} className="font-mono font-semibold hover:text-[#D31218]">+91 {lead.phone}</a>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <span className="truncate">{lead.email ? <a href={`mailto:${lead.email}`} className="hover:text-[#D31218]">{lead.email}</a> : 'None Provided'}</span>
                            </div>
                          </div>

                          <div className="bg-[#F8FAFC] p-2.5 rounded text-xs text-gray-700 space-y-1">
                            <p className="font-semibold text-[#0D2C54] text-[10px] font-space uppercase">Target Course / Program:</p>
                            <p className="font-sans font-medium">{lead.course ? lead.course.replace(/_/g, ' ').toUpperCase() : 'GENERAL INQUIRY'}</p>
                            {lead.message && (
                              <>
                                <p className="font-semibold text-[#0D2C54] text-[10px] font-space uppercase mt-1.5">Submitted Notes / Form Data:</p>
                                <p className="font-sans italic text-gray-600">"{lead.message}"</p>
                              </>
                            )}
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="text-rose-600 hover:text-rose-800 flex items-center gap-1 text-[10px] font-space uppercase font-bold cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete lead
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white rounded-xl border border-gray-100">
                      <p className="font-sans text-xs text-gray-400">No matching leads found for filter "{activeFilter}".</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Footer info */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                <p className="text-[10px] font-space text-gray-400 uppercase tracking-wider">
                  D'code IAS Academy lead database • SQLite & Nodemailer API Connected
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
