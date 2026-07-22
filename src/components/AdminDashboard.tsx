import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  Mail,
  Phone,
  Trash2,
  X,
  Search,
  Download,
  LogOut,
  RefreshCcw,
  Filter,
  Users,
  GraduationCap,
  FileText,
  Clock,
  CheckCircle2,
  MessageSquare,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  fetchAdminDashboardStatsApi,
  updateInquiryStatusApi,
  deleteInquiryApi,
  adminLogoutApi,
  getAdminSession,
  ApiInquiry,
  DashboardStats
} from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [inquiries, setInquiries] = useState<ApiInquiry[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    enrollmentsCount: 0,
    registrationsCount: 0,
    contactsCount: 0,
    pendingCount: 0,
    contactedCount: 0,
    enrolledCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'enrollment' | 'registration' | 'contact'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'New' | 'Contacted' | 'Enrolled'>('all');
  const [latestEmailLogs, setLatestEmailLogs] = useState<{ clientEmail: any; studentEmail: any } | null>(null);

  const session = getAdminSession();

  const loadDashboardData = async () => {
    setLoading(true);
    const data = await fetchAdminDashboardStatsApi();
    setStats(data.stats);
    setInquiries(data.inquiries);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }

    const handleLeadsUpdate = () => {
      if (isOpen) loadDashboardData();
    };

    const handleEmailDispatch = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setLatestEmailLogs(customEvent.detail);
      }
    };

    window.addEventListener('dcode_leads_updated', handleLeadsUpdate);
    window.addEventListener('dcode_email_dispatched', handleEmailDispatch);

    return () => {
      window.removeEventListener('dcode_leads_updated', handleLeadsUpdate);
      window.removeEventListener('dcode_email_dispatched', handleEmailDispatch);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStatusChange = async (id: string, status: 'New' | 'Contacted' | 'Enrolled') => {
    await updateInquiryStatusApi(id, status);
    loadDashboardData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead record permanently?')) {
      await deleteInquiryApi(id);
      loadDashboardData();
    }
  };

  const handleLogout = () => {
    adminLogoutApi();
    onClose();
  };

  // Filtering Logic
  const filteredInquiries = inquiries.filter((item) => {
    // 1. Category Filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'contact' && item.formType && item.formType !== 'contact' && item.formType !== 'inquiry') {
        return false;
      }
      if (categoryFilter !== 'contact' && item.formType !== categoryFilter) {
        return false;
      }
    }

    // 2. Status Filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    // 3. Search Term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const name = (item.fullName || '').toLowerCase();
      const phone = (item.phone || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      const course = (item.course || '').toLowerCase();
      const id = (item.id || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || email.includes(q) || course.includes(q) || id.includes(q);
    }

    return true;
  });

  // CSV Export helper
  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Full Name', 'Phone', 'Email', 'Form Type', 'Course', 'Status', 'Message'];
    const rows = filteredInquiries.map((item) => [
      `"${item.id}"`,
      `"${new Date(item.createdAt).toLocaleString()}"`,
      `"${item.fullName.replace(/"/g, '""')}"`,
      `"${item.phone}"`,
      `"${item.email || 'N/A'}"`,
      `"${item.formType || 'contact'}"`,
      `"${(item.course || 'General').replace(/_/g, ' ')}"`,
      `"${item.status}"`,
      `"${(item.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dcode_IAS_Leads_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-center items-center p-2 sm:p-4 md:p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-7xl h-[94vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#0D2C54]/15"
        >
          {/* Header */}
          <header className="p-4 sm:p-6 bg-[#0D2C54] text-white flex flex-wrap items-center justify-between gap-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#D31218] rounded-2xl shadow-lg shadow-[#D31218]/30 text-white">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                    D'code IAS Master Admin Dashboard
                  </h2>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-space px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live DB Connected
                  </span>
                </div>
                <p className="font-space text-[10px] text-gray-300 uppercase tracking-widest mt-0.5">
                  Logged in as: <span className="text-white font-bold">{session?.admin?.email || 'info@decodeias.com'}</span> • Role: Administrator
                </p>
              </div>
            </div>

            {/* Quick Action Header Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-space font-bold uppercase tracking-wider transition-all cursor-pointer border border-white/10"
                title="Reload latest submissions"
              >
                <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-space font-bold uppercase tracking-wider transition-all cursor-pointer border-none shadow-sm"
                title="Download CSV report of leads"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#D31218] hover:bg-[#A30D12] text-white rounded-xl text-xs font-space font-bold uppercase tracking-wider transition-all cursor-pointer border-none shadow-sm"
                title="Sign out of admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer ml-1"
                aria-label="Close dashboard"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Dashboard Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC] space-y-6">

            {/* 1. KPI Metric Cards Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Leads */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-space text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Total Submissions
                  </p>
                  <p className="font-serif text-3xl font-extrabold text-[#0D2C54] mt-1">
                    {stats.totalLeads}
                  </p>
                  <p className="text-[10px] text-gray-500 font-sans mt-1">
                    All inquiries & registrations
                  </p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              {/* Card 2: Enrolled Students */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-space text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Enrolled Students
                  </p>
                  <p className="font-serif text-3xl font-extrabold text-emerald-600 mt-1">
                    {stats.enrolledCount}
                  </p>
                  <p className="text-[10px] text-gray-500 font-sans mt-1">
                    {stats.enrollmentsCount} explicit course applications
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>

              {/* Card 3: Contact / Course Inquiries */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-space text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Inquiries & Contacts
                  </p>
                  <p className="font-serif text-3xl font-extrabold text-amber-600 mt-1">
                    {stats.contactsCount + stats.registrationsCount}
                  </p>
                  <p className="text-[10px] text-gray-500 font-sans mt-1">
                    Web & popup contact requests
                  </p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              {/* Card 4: Pending Follow-ups */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-space text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    New Action Items
                  </p>
                  <p className="font-serif text-3xl font-extrabold text-[#D31218] mt-1">
                    {stats.pendingCount}
                  </p>
                  <p className="text-[10px] text-gray-500 font-sans mt-1">
                    Requires follow-up call
                  </p>
                </div>
                <div className="p-3 bg-red-50 text-[#D31218] rounded-2xl">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
              </div>

            </div>

            {/* 2. Controls Bar: Search, Category Tabs, Status Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Search Input */}
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by student name, phone, email, or course..."
                    className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-[#0D2C54] transition-all font-sans"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { key: 'all', label: `All (${inquiries.length})` },
                    { key: 'enrollment', label: `Enrollments (${stats.enrollmentsCount})` },
                    { key: 'registration', label: `Registrations (${stats.registrationsCount})` },
                    { key: 'contact', label: `Contacts (${stats.contactsCount})` }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setCategoryFilter(tab.key as any)}
                      className={`text-xs font-space px-3 py-1.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                        categoryFilter === tab.key
                          ? 'bg-[#0D2C54] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

              </div>

              {/* Status Filter Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                <div className="flex items-center gap-1.5 text-gray-500 font-space font-bold uppercase text-[10px]">
                  <Filter className="w-3.5 h-3.5 text-[#D31218]" /> Status Filter:
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { key: 'all', label: 'All Statuses' },
                    { key: 'New', label: `New (${stats.pendingCount})` },
                    { key: 'Contacted', label: `Contacted (${stats.contactedCount})` },
                    { key: 'Enrolled', label: `Enrolled (${stats.enrolledCount})` }
                  ].map((st) => (
                    <button
                      key={st.key}
                      onClick={() => setStatusFilter(st.key as any)}
                      className={`text-[10px] font-space px-2.5 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                        statusFilter === st.key
                          ? 'bg-[#D31218] text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* 3. Database Entries Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-3">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#0D2C54]" />
                  <h3 className="font-serif text-base font-bold text-[#0D2C54]">
                    Student Database Records ({filteredInquiries.length})
                  </h3>
                </div>
                <span className="text-[10px] font-space text-gray-400 uppercase">
                  Showing {filteredInquiries.length} of {inquiries.length} entries
                </span>
              </div>

              {filteredInquiries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#F8FAFC] font-space text-[10px] uppercase text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="p-4">Student & ID</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Category & Program</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status & Action</th>
                        <th className="p-4 text-right">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredInquiries.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                          
                          {/* Student Name */}
                          <td className="p-4 align-top">
                            <p className="font-bold text-[#0D2C54] text-sm">{item.fullName}</p>
                            <p className="font-mono text-[9px] text-gray-400 uppercase mt-0.5">{item.id}</p>
                          </td>

                          {/* Contact Info */}
                          <td className="p-4 align-top space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-700 font-mono font-semibold">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <a href={`tel:${item.phone}`} className="hover:text-[#D31218]">+91 {item.phone}</a>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <span className="truncate max-w-[180px]">
                                {item.email ? <a href={`mailto:${item.email}`} className="hover:text-[#D31218]">{item.email}</a> : 'Not Provided'}
                              </span>
                            </div>
                          </td>

                          {/* Category & Program */}
                          <td className="p-4 align-top space-y-1">
                            <span className={`inline-block text-[9px] font-space font-bold uppercase px-2 py-0.5 rounded ${
                              item.formType === 'enrollment' ? 'bg-blue-100 text-blue-800' :
                              item.formType === 'registration' ? 'bg-purple-100 text-purple-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {item.formType || 'contact'}
                            </span>
                            <p className="font-medium text-[#0D2C54] capitalize">
                              {item.course ? item.course.replace(/_/g, ' ') : 'General Inquiry'}
                            </p>
                            {item.message && (
                              <p className="text-[11px] text-gray-500 italic max-w-xs truncate" title={item.message}>
                                "{item.message}"
                              </p>
                            )}
                          </td>

                          {/* Date */}
                          <td className="p-4 align-top text-gray-500 font-mono text-[11px]">
                            {new Date(item.createdAt).toLocaleDateString()}<br />
                            <span className="text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </td>

                          {/* Status */}
                          <td className="p-4 align-top">
                            <div className="flex items-center gap-1 flex-wrap">
                              {(['New', 'Contacted', 'Enrolled'] as const).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleStatusChange(item.id, st)}
                                  className={`text-[9px] font-space px-2 py-1 rounded-md font-bold cursor-pointer transition-colors ${
                                    item.status === st
                                      ? st === 'New'
                                        ? 'bg-[#D31218] text-white shadow-xs'
                                        : st === 'Contacted'
                                        ? 'bg-amber-500 text-white shadow-xs'
                                        : 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-4 align-top text-right">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-serif text-sm font-bold text-gray-600">No leads found matching your criteria</p>
                  <p className="text-xs text-gray-400 mt-1">Try clearing your search keyword or switching category tabs.</p>
                </div>
              )}
            </div>

            {/* 4. Nodemailer Dispatcher Real-time Logs Monitor */}
            <div className="bg-white border border-[#D31218]/15 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#D31218]" />
                  <h4 className="font-serif text-sm font-bold text-[#0D2C54]">
                    Nodemailer Dispatcher Monitor
                  </h4>
                </div>
                <span className="font-space text-[9px] bg-[#D31218]/10 text-[#D31218] px-2.5 py-0.5 rounded-full uppercase font-bold">
                  Active Dispatch Stream
                </span>
              </div>

              {latestEmailLogs ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Owner Log */}
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs space-y-1.5">
                    <p className="font-space text-[9px] font-bold text-gray-400 uppercase">Owner Email Dispatched To:</p>
                    <p className="font-mono text-emerald-600 font-bold">{latestEmailLogs.clientEmail.to}</p>
                    <p className="font-semibold text-[#0D2C54]">{latestEmailLogs.clientEmail.subject}</p>
                  </div>
                  {/* Student Confirmation */}
                  <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl text-xs space-y-1.5">
                    <p className="font-space text-[9px] font-bold text-emerald-700 uppercase">Student Receipt Dispatched To:</p>
                    <p className="font-mono text-emerald-700 font-bold">{latestEmailLogs.studentEmail?.to || 'No email provided'}</p>
                    <p className="font-semibold text-emerald-900">{latestEmailLogs.studentEmail?.subject || 'N/A'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No automated dispatches during this session. Submitting any form on the academy site will show real-time Nodemailer transmission logs here.
                </p>
              )}
            </div>

          </div>

          {/* Dashboard Footer */}
          <footer className="p-4 bg-gray-50 border-t border-gray-100 text-center text-[10px] font-space text-gray-400 uppercase tracking-widest shrink-0">
            D'code IAS Academy • Owner Admin Portal • Version 2.0
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
