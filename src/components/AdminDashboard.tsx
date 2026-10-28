import AdminColorPalette from './AdminColorPalette';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, 
  ArrowLeft,
  Shield,
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Search,
  Filter,
  Download,
  FileText,
  Copy,
  Check,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  RefreshCcw,
  RotateCcw,
  LogOut,
  X,
  Menu,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  AlertCircle,
  Database,
  Eye,
  Send,
  Share2
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
import {
  getStoredBatches,
  saveStoredBatch,
  deleteStoredBatch,
  resetStoredBatches
} from '../services/batchService';
import { BatchSchedule } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  isPage?: boolean;
  onBackToHome?: () => void;
  onLogout?: () => void;
}

type TabType = 'overview' | 'leads' | 'batches' | 'palette' | 'system';

export function normalizeCourseName(rawCourse?: string): string {
  if (!rawCourse) return 'General Guidance';
  const c = rawCourse.trim().toLowerCase();
  if (c.includes('mains_momentum') || c.includes('mains momentum')) return 'Mains Momentum 2027';
  if (c.includes('prelims_conquer') || c.includes('prelims conquer') || c.includes('prelims 2027')) return 'UPSC Prelims Conquer 2027';
  if (c.includes('pcm') || c.includes('comprehensive')) return 'PCM Comprehensive';
  if (c.includes('sociology')) return 'Sociology Optional';
  if (c.includes('anthropology')) return 'Anthropology Optional';
  if (c.includes('public_admin') || c.includes('public admin')) return 'Public Administration Optional';
  if (c.includes('tnpsc')) return 'TNPSC Group 1, 2 & 4';
  if (c === 'course') return 'General Guidance';
  return rawCourse.trim();
}

export default function AdminDashboard({ isOpen, onClose, isPage, onBackToHome, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      const paramTab = new URLSearchParams(window.location.search).get('tab');
      if (paramTab === 'palette' || paramTab === 'leads' || paramTab === 'batches' || paramTab === 'system') {
        return paramTab as TabType;
      }
    }
    return 'overview';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());
    }
  };

  // Leads & Stats State
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

  // Filters State for Leads: Only Date Filter & Course Type Dropdown (+ Search)
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'range' | 'today' | '7days' | '30days' | 'this_month' | 'custom'>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [customDate, setCustomDate] = useState<string>('');
  const [isCsvPreviewOpen, setIsCsvPreviewOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);
  const [dateSortOrder, setDateSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedLead, setSelectedLead] = useState<ApiInquiry | null>(null);

  // Pagination State for Leads
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Batches State
  const [batches, setBatches] = useState<BatchSchedule[]>([]);
  const [editingBatch, setEditingBatch] = useState<BatchSchedule | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchFormData, setBatchFormData] = useState<BatchSchedule>({
    id: '',
    name: '',
    startDate: '',
    mode: 'Offline + Online',
    availability: 'Coming Soon'
  });

  const session = getAdminSession();

  // Load Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminDashboardStatsApi();
      setStats(data.stats);
      setInquiries(data.inquiries);
      setBatches(getStoredBatches());
    } catch (err) {
      console.warn('[ADMIN] Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }

    const handleLeadsUpdate = () => {
      if (isOpen) loadDashboardData();
    };

    const handleBatchesUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setBatches(customEvent.detail);
      } else {
        setBatches(getStoredBatches());
      }
    };

    window.addEventListener('dcode_leads_updated', handleLeadsUpdate);
    window.addEventListener('dcode_batches_updated', handleBatchesUpdate);

    return () => {
      window.removeEventListener('dcode_leads_updated', handleLeadsUpdate);
      window.removeEventListener('dcode_batches_updated', handleBatchesUpdate);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Lead actions
  const handleStatusChange = async (id: string, status: 'New' | 'Contacted' | 'Enrolled') => {
    await updateInquiryStatusApi(id, status);
    loadDashboardData();
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this lead record?')) {
      await deleteInquiryApi(id);
      loadDashboardData();
      if (selectedLead?.id === id) setSelectedLead(null);
    }
  };

  // Generate clean, standard CSV content with proper UTF-8 escaping
  const generateCsvContent = () => {
    const headers = ['ID', 'Date & Time', 'Full Name', 'Phone', 'Email', 'Course', 'Type', 'Status', 'Message'];
    const rows = filteredInquiries.map(item => [
      `"${item.id}"`,
      `"${item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : ''}"`,
      `"${(item.fullName || '').replace(/"/g, '""')}"`,
      `"${item.phone || ''}"`,
      `"${item.email || ''}"`,
      `"${normalizeCourseName(item.course)}"`,
      `"${item.formType || 'contact'}"`,
      `"${item.status}"`,
      `"${(item.message || '').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
  };

  // Copy CSV data to clipboard
  const handleCopyCsvToClipboard = () => {
    const csvContent = generateCsvContent();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(csvContent).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = csvContent;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Export Leads to CSV: Direct file download across all desktop & mobile browsers (Edge, Chrome, Safari, Firefox, Opera)
  const handleExportCSV = () => {
    if (filteredInquiries.length === 0) {
      alert('No leads to export under current filters.');
      return;
    }

    const csvContent = generateCsvContent();
    const filename = `dcode_ias_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    // Add UTF-8 BOM so Excel, Google Sheets, and LibreOffice correctly parse Indian names & special characters
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

    // 1. Legacy Microsoft Edge / Internet Explorer msSaveOrOpenBlob compatibility
    if (typeof window !== 'undefined' && (window.navigator as any)?.msSaveOrOpenBlob) {
      try {
        (window.navigator as any).msSaveOrOpenBlob(blob, filename);
        setDownloadSuccessToast(`Downloaded "${filename}" directly to your device.`);
        return;
      } catch (msErr) {
        console.warn('[CSV MS SAVE BLOB ERROR]', msErr);
      }
    }

    // 2. Direct Blob ObjectURL download (Guarantees file download to Downloads folder in Edge, Chrome, Safari, Firefox)
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        try {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch {
          // ignore cleanup errors
        }
      }, 1500);

      setDownloadSuccessToast(`Downloaded "${filename}" directly to your device.`);
    } catch (dlErr) {
      console.error('[CSV DOWNLOAD ERROR]', dlErr);
      // Fallback: data URI click
      try {
        const encodedUri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvContent);
        const link = document.createElement('a');
        link.href = encodedUri;
        link.setAttribute('download', filename);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          try {
            document.body.removeChild(link);
          } catch {}
        }, 500);
        setDownloadSuccessToast(`Downloaded "${filename}".`);
      } catch (fbErr) {
        setIsCsvPreviewOpen(true);
      }
    }
  };

  // Optional mobile / device Share action when admin explicitly wants to share via WhatsApp, AirDrop, or Mail
  const handleShareCSV = async () => {
    if (filteredInquiries.length === 0) {
      alert('No leads to share under current filters.');
      return;
    }

    const csvContent = generateCsvContent();
    const filename = `dcode_ias_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

    if (typeof navigator !== 'undefined' && (navigator as any).canShare) {
      try {
        const file = new File([blob], filename, { type: 'text/csv' });
        if ((navigator as any).canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: filename,
            text: `D'code IAS Academy - ${filteredInquiries.length} Student Leads Export`
          });
          setDownloadSuccessToast('CSV shared successfully!');
          return;
        }
      } catch (shareErr: any) {
        if (shareErr.name === 'AbortError') return;
      }
    }

    // If Web Share API is unavailable or rejected, fall back to direct download
    handleExportCSV();
  };

  // Batch actions
  const handleOpenCreateBatch = () => {
    setEditingBatch(null);
    setBatchFormData({
      id: `batch_${Date.now()}`,
      name: '',
      startDate: '',
      mode: 'Offline + Online',
      availability: 'Coming Soon'
    });
    setIsBatchModalOpen(true);
  };

  const handleOpenEditBatch = (batch: BatchSchedule) => {
    setEditingBatch(batch);
    setBatchFormData({ ...batch });
    setIsBatchModalOpen(true);
  };

  const handleSaveBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchFormData.name.trim() || !batchFormData.startDate.trim()) {
      alert('Please fill in both the Batch Name and Start Date.');
      return;
    }
    const updated = saveStoredBatch(batchFormData);
    setBatches(updated);
    setIsBatchModalOpen(false);
  };

  const handleDeleteBatch = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the batch "${name}"?`)) {
      const updated = deleteStoredBatch(id);
      setBatches(updated);
    }
  };

  const handleToggleBatchStatus = (batch: BatchSchedule) => {
    const statuses: BatchSchedule['availability'][] = ['Coming Soon', 'Open', 'Limited Seats', 'Last 5 Seats', 'Closed'];
    const currentIndex = statuses.indexOf(batch.availability);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    const updated = saveStoredBatch({ ...batch, availability: nextStatus });
    setBatches(updated);
  };

  const handleResetBatches = () => {
    if (window.confirm('Reset upcoming batches to default 3 schedules?')) {
      const def = resetStoredBatches();
      setBatches(def);
    }
  };

  const handleLogout = () => {
    adminLogoutApi();
    if (onLogout) {
      onLogout();
    } else {
      onClose();
    }
  };

  // Dynamic list of unique courses normalized with live submission counts
  const courseOptionsWithCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const item of inquiries) {
      const c = normalizeCourseName(item.course);
      map.set(c, (map.get(c) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [inquiries]);

  // Filter and sort inquiries by Date and Course Type (+ Search)
  const filteredInquiries = inquiries
    .filter((item) => {
      // 1. Course Type Filter
      if (courseFilter !== 'all') {
        const itemNorm = normalizeCourseName(item.course);
        if (itemNorm !== courseFilter && item.course !== courseFilter) {
          return false;
        }
      }

      // 2. Date Filter (Supports 'range' From Date - To Date, Presets, and Single Date)
      if (dateFilter !== 'all') {
        const itemDate = new Date(item.createdAt || 0);
        const now = new Date();
        if (dateFilter === 'range') {
          if (fromDate) {
            const [fy, fm, fd] = fromDate.split('-').map(Number);
            const fromTime = new Date(fy, fm - 1, fd, 0, 0, 0, 0).getTime();
            if (itemDate.getTime() < fromTime) return false;
          }
          if (toDate) {
            const [ty, tm, td] = toDate.split('-').map(Number);
            const toTime = new Date(ty, tm - 1, td, 23, 59, 59, 999).getTime();
            if (itemDate.getTime() > toTime) return false;
          }
        } else if (dateFilter === 'today') {
          if (itemDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === '7days') {
          if (now.getTime() - itemDate.getTime() > 7 * 24 * 3600 * 1000) return false;
        } else if (dateFilter === '30days') {
          if (now.getTime() - itemDate.getTime() > 30 * 24 * 3600 * 1000) return false;
        } else if (dateFilter === 'this_month') {
          if (itemDate.getMonth() !== now.getMonth() || itemDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (dateFilter === 'custom' && customDate) {
          const itemYMD = itemDate.toISOString().slice(0, 10);
          if (itemYMD !== customDate) return false;
        }
      }

      // 3. Search query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const name = (item.fullName || '').toLowerCase();
        const phone = (item.phone || '').toLowerCase();
        const email = (item.email || '').toLowerCase();
        const course = (item.course || '').toLowerCase();
        const norm = normalizeCourseName(item.course).toLowerCase();
        const msg = (item.message || '').toLowerCase();
        const id = (item.id || '').toLowerCase();
        return (
          name.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          course.includes(q) ||
          norm.includes(q) ||
          msg.includes(q) ||
          id.includes(q)
        );
      }

      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return dateSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, courseFilter, dateFilter, fromDate, toDate, customDate, dateSortOrder]);

  // Derived Pagination Calculations
  const totalLeads = filteredInquiries.length;
  const totalPages = Math.max(1, Math.ceil(totalLeads / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalLeads);
  const paginatedInquiries = filteredInquiries.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (safeCurrentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (safeCurrentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages);
    }
    return pages;
  };

  const isFilteredActive =
    searchTerm.trim() !== '' ||
    courseFilter !== 'all' ||
    dateFilter !== 'all' ||
    fromDate !== '' ||
    toDate !== '' ||
    customDate !== '' ||
    dateSortOrder !== 'desc';

  const handleResetFilters = () => {
    setSearchTerm('');
    setCourseFilter('all');
    setDateFilter('all');
    setFromDate('');
    setToDate('');
    setCustomDate('');
    setDateSortOrder('desc');
    setCurrentPage(1);
  };

  const dashboardContent = (
    <div className={`w-full bg-[#F8FAFC] flex flex-col overflow-hidden ${isPage ? 'min-h-screen flex-1' : 'max-w-[1440px] h-[95vh] rounded-3xl shadow-2xl border border-gray-200'}`}>
      {/* Top Bar Header */}
      <header className="px-3 sm:px-5 py-2.5 sm:py-3.5 bg-[#0D2C54] text-white flex items-center justify-between gap-2 sm:gap-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            aria-label="Open Navigation Menu"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-space font-bold uppercase tracking-wider transition-all cursor-pointer border border-white/10 shrink-0"
              title="Return to Main Website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Main Site</span>
            </button>
          )}

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D31218] flex items-center justify-center text-white shadow-md shadow-red-900/40 shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-sm sm:text-base md:text-lg font-bold text-white tracking-wide truncate">
                <span className="sm:hidden">D'code Admin</span>
                <span className="hidden sm:inline">D'code IAS Master Admin Panel</span>
              </h2>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-space font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live System
              </span>
            </div>
            <p className="font-space text-[10px] text-gray-300 uppercase tracking-widest mt-0.5 hidden lg:block truncate">
              Admin: <strong className="text-white">{session?.admin?.email || 'admin@decodeias.com'}</strong> • Role: Master Administrator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-space font-bold uppercase tracking-wider transition-all cursor-pointer border border-white/10"
            title="Refresh all data"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => handleSelectTab('palette')}
            className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-space font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === 'palette'
                ? 'bg-amber-400 text-black border-amber-300 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
            title="Customize Website Color Theme"
          >
            <Palette className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Color Theme</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#D31218] hover:bg-[#A30D12] text-white text-xs font-space font-bold uppercase tracking-wider transition-all cursor-pointer border-none shadow-sm"
            title="Sign out of admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Close admin dashboard"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Quick Module Switcher (Horizontal Sticky Tabs) */}
      <div className="md:hidden bg-white border-b border-gray-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 shadow-xs">
        <button
          onClick={() => handleSelectTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#0D2C54] text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => handleSelectTab('leads')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'leads'
              ? 'bg-[#0D2C54] text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span>Leads ({stats.totalLeads})</span>
        </button>

        <button
          onClick={() => handleSelectTab('batches')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'batches'
              ? 'bg-[#0D2C54] text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Batches ({batches.length})</span>
        </button>

        <button
          onClick={() => handleSelectTab('palette')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'palette'
              ? 'bg-[#0D2C54] text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Color Theme</span>
        </button>

        <button
          onClick={() => handleSelectTab('system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'system'
              ? 'bg-[#0D2C54] text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-purple-400" />
          <span>System</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay and Sidebar Navigation */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              aria-label="Close menu backdrop"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between p-4 z-10 overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0D2C54] flex items-center justify-center text-white shadow-sm">
                      <Shield className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#0D2C54]">D'code IAS Admin</h3>
                      <p className="text-[10px] text-gray-400 font-mono">Mobile Navigation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Close navigation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <p className="px-3 text-[10px] font-space font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Management Modules
                  </p>
                  <nav className="space-y-1.5">
                    <button
                      onClick={() => handleSelectTab('overview')}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        activeTab === 'overview'
                          ? 'bg-[#0D2C54] text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-4 h-4 text-amber-400" />
                        <span>Dashboard Overview</span>
                      </div>
                      <span className="text-xs font-mono opacity-80">01</span>
                    </button>

                    <button
                      onClick={() => handleSelectTab('leads')}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        activeTab === 'leads'
                          ? 'bg-[#0D2C54] text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>Leads & Enquiries</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-600 text-white font-mono">
                        {stats.totalLeads}
                      </span>
                    </button>

                    <button
                      onClick={() => handleSelectTab('batches')}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        activeTab === 'batches'
                          ? 'bg-[#0D2C54] text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <span>Upcoming Batches</span>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {batches.length}
                      </span>
                    </button>

                    
                    <button
                      onClick={() => handleSelectTab('palette')}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        activeTab === 'palette'
                          ? 'bg-[#0D2C54] text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Palette className="w-4 h-4 text-amber-400" />
                        <span>Color Theme Customizer</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                        NEW
                      </span>
                    </button>
                    <button
                      onClick={() => handleSelectTab('system')}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        activeTab === 'system'
                          ? 'bg-[#0D2C54] text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-4 h-4 text-purple-400" />
                        <span>System & Logs</span>
                      </div>
                      <span className="text-xs font-mono opacity-80">04</span>
                    </button>
                  </nav>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0D2C54]/5 border border-[#0D2C54]/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Pending Action:</span>
                    <span className="font-bold text-amber-600 font-mono">{stats.pendingCount} New</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Confirmed:</span>
                    <span className="font-bold text-emerald-600 font-mono">{stats.enrolledCount} Enrolled</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: stats.totalLeads > 0 ? `${(stats.enrolledCount / stats.totalLeads) * 100}%` : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2.5">
                <div className="p-2.5 rounded-xl bg-gray-50 text-[11px] text-gray-600">
                  <p className="font-bold text-gray-900 truncate">{session?.admin?.email || 'admin@decodeias.com'}</p>
                  <p className="text-[10px] text-gray-400">Master Administrator</p>
                </div>
                <button
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out Admin</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Layout with Left Menu Navigation */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Left Sidebar Menu */}
        <aside className="hidden md:flex flex-col justify-between w-56 lg:w-64 bg-white border-r border-gray-200 shrink-0 p-3 sm:p-4">
          <div className="space-y-6">
            <div>
              <p className="px-3 text-[10px] font-space font-bold uppercase tracking-widest text-gray-400 mb-2">
                Management Modules
              </p>
              <nav className="space-y-1">
                <button
                  onClick={() => handleSelectTab('overview')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-[#0D2C54] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#0D2C54]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-amber-300" />
                    <span>Dashboard</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">01</span>
                </button>

                <button
                  onClick={() => handleSelectTab('leads')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'leads'
                      ? 'bg-[#0D2C54] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#0D2C54]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Leads & Enquiries</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-600 text-white font-mono">
                    {stats.totalLeads}
                  </span>
                </button>

                <button
                  onClick={() => handleSelectTab('batches')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'batches'
                      ? 'bg-[#0D2C54] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#0D2C54]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Upcoming Batches</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {batches.length}
                  </span>
                </button>

                
                <button
                  onClick={() => handleSelectTab('palette')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'palette'
                      ? 'bg-[#0D2C54] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#0D2C54]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>Color Theme Customizer</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-space uppercase">
                    NEW
                  </span>
                </button>
                <button
                  onClick={() => handleSelectTab('system')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'system'
                      ? 'bg-[#0D2C54] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#0D2C54]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span>System & Logs</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">05</span>
                </button>
              </nav>
            </div>

            {/* Quick Quick Stat Box in Desktop Sidebar */}
            <div className="p-3.5 rounded-2xl bg-[#0D2C54]/5 border border-[#0D2C54]/10 space-y-2 hidden sm:block">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Pending Action:</span>
                <span className="font-bold text-amber-600 font-mono">{stats.pendingCount} New</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Confirmed:</span>
                <span className="font-bold text-emerald-600 font-mono">{stats.enrolledCount} Enrolled</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: stats.totalLeads > 0 ? `${(stats.enrolledCount / stats.totalLeads) * 100}%` : '0%'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Version Tag */}
          <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-400 font-space flex items-center justify-between">
            <span>D'code IAS v2.4</span>
            <span className="text-emerald-600 font-bold">● Online</span>
          </div>
        </aside>

            {/* Right Main Content Area */}
            <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8 space-y-4 sm:space-y-6 min-w-0">

              {/* ======================================================== */}
              {/* TAB 1: OVERVIEW DASHBOARD                                */}
              {/* ======================================================== */}
              {activeTab === 'overview' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Welcome Banner */}
                  <div className="bg-gradient-to-r from-[#0D2C54] via-[#1A3D6D] to-[#0A2244] text-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 sm:space-y-2 relative z-10 max-w-xl">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] sm:text-xs font-space font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Admin Command Center
                      </div>
                      <h3 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-white">
                        Welcome to Academy Administration
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                        Track live student admissions, manage UPSC Prelims Conquer 2027 applicant queries, and configure upcoming batch schedules directly from this console.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 relative z-10 w-full sm:w-auto">
                      <button
                        onClick={() => handleSelectTab('leads')}
                        className="flex-1 sm:flex-initial justify-center px-4 py-2 sm:py-2.5 rounded-xl bg-[#D31218] hover:bg-[#A30D12] text-white text-xs font-bold font-space uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Users className="w-4 h-4" />
                        <span>Manage Leads ({stats.totalLeads})</span>
                      </button>
                      <button
                        onClick={() => handleSelectTab('batches')}
                        className="flex-1 sm:flex-initial justify-center px-4 py-2 sm:py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold font-space uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border border-white/20"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Edit Batches</span>
                      </button>
                      <button
                        onClick={() => handleSelectTab('palette')}
                        className="flex-1 sm:flex-initial justify-center px-4 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold font-space uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Palette className="w-4 h-4 text-black" />
                        <span>Customize Color Theme</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Core KPI Cards (Responsive 2x2 grid on mobile, 4-col on desktop) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                    <div className="bg-white p-3 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                      <div>
                        <p className="font-space text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Submissions</p>
                        <p className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0D2C54] mt-0.5 sm:mt-1 font-space">{stats.totalLeads}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 truncate">All inquiry channels</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl shrink-0 self-end xs:self-auto">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-3 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                      <div>
                        <p className="font-space text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Action</p>
                        <p className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-600 mt-0.5 sm:mt-1 font-space">{stats.pendingCount}</p>
                        <p className="text-[10px] text-amber-700 mt-0.5 truncate">Needs counselor callback</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-amber-50 text-amber-600 rounded-xl sm:rounded-2xl shrink-0 self-end xs:self-auto">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-3 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                      <div>
                        <p className="font-space text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirmed Enrolled</p>
                        <p className="font-serif text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-0.5 sm:mt-1 font-space">{stats.enrolledCount}</p>
                        <p className="text-[10px] text-emerald-700 mt-0.5 truncate">Confirmed student seats</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl shrink-0 self-end xs:self-auto">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-3 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                      <div>
                        <p className="font-space text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Batches</p>
                        <p className="font-serif text-2xl sm:text-3xl font-extrabold text-purple-600 mt-0.5 sm:mt-1 font-space">{batches.length}</p>
                        <p className="text-[10px] text-purple-700 mt-0.5 truncate">Publicly displayed</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-purple-50 text-purple-600 rounded-xl sm:rounded-2xl shrink-0 self-end xs:self-auto">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Inquiries Preview Grid */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#0D2C54]">Recent Applicant Inquiries</h4>
                        <p className="text-xs text-gray-500">Latest student contact and registration requests</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('leads')}
                        className="text-xs font-bold text-[#D31218] hover:underline flex items-center gap-1"
                      >
                        <span>View All Leads</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {inquiries.slice(0, 5).map(item => (
                        <div key={item.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50/60 rounded-xl px-2.5 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0D2C54] font-bold text-sm flex items-center justify-center shrink-0">
                              {(item.fullName || 'A').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-gray-900">{item.fullName}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                <span>{item.phone}</span>
                                {item.course && <span className="text-blue-600 font-medium font-mono text-[11px]">• {normalizeCourseName(item.course)}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 self-end sm:self-auto">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-space ${
                              item.status === 'New' ? 'bg-amber-100 text-amber-800' :
                              item.status === 'Contacted' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {item.status}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedLead(item);
                                setActiveTab('leads');
                              }}
                              className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-[#0D2C54] hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}

                      {inquiries.length === 0 && (
                        <div className="py-12 text-center text-gray-400 text-sm">
                          No inquiries received yet. New submissions from your website will appear here instantly.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: LEADS MANAGEMENT (With Search & Filter Icons)     */}
              {/* ======================================================== */}
              {activeTab === 'leads' && (
                <div className="space-y-5">
                  {/* Header Title & CSV Export */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0D2C54]">
                        Leads & Student Registrations
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Showing {totalLeads > 0 ? `${startIndex + 1}–${endIndex}` : '0'} of {totalLeads} matching leads ({inquiries.length} total across academy)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setIsCsvPreviewOpen(true)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold uppercase font-space tracking-wider transition-colors shadow-2xs cursor-pointer"
                        title="View spreadsheet table preview on screen"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="hidden xs:inline">Preview</span>
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D2C54] hover:bg-[#D31218] text-white text-xs font-bold uppercase font-space tracking-wider transition-colors shadow-xs cursor-pointer"
                        title="Directly download CSV file to your Downloads folder"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download CSV</span>
                      </button>

                      {typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function' && (
                        <button
                          onClick={handleShareCSV}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase font-space tracking-wider transition-colors cursor-pointer"
                          title="Share CSV via WhatsApp, Email, or AirDrop"
                        >
                          <Share2 className="w-4 h-4 text-gray-600" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search Bar & Filter Options Bar */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by student name, phone number, email, or course..."
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/20 focus:border-[#0D2C54] bg-[#F8FAFC]"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Two Dedicated Filter Options: 1. Date & Time Filter + 2. Course Type Dropdown (+ Search & Reset) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-gray-100 text-xs">
                      
                      <div className="flex flex-wrap items-center gap-3">
                        {/* FILTER OPTION 1: DATE & TIME FILTER */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1.5 text-gray-700 font-bold uppercase text-[11px] tracking-wider font-space">
                            <Calendar className="w-4 h-4 text-[#D31218]" />
                            <span>Date:</span>
                          </div>
                          <select
                            value={dateFilter}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setDateFilter(val);
                              if (val !== 'custom') setCustomDate('');
                              if (val !== 'range') {
                                setFromDate('');
                                setToDate('');
                              }
                            }}
                            className="text-xs py-1.5 px-3 rounded-xl border border-gray-200 bg-[#F8FAFC] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/20 focus:border-[#0D2C54] cursor-pointer"
                          >
                            <option value="all">All Dates / All Time</option>
                            <option value="range">From Date — To Date</option>
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="this_month">This Month</option>
                            <option value="custom">Specific Date Calendar...</option>
                          </select>

                          {/* From Date - To Date Range Inputs */}
                          {dateFilter === 'range' && (
                            <div className="flex flex-wrap items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-gray-200 shadow-2xs">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase font-space">From:</span>
                                <input
                                  type="date"
                                  value={fromDate}
                                  onChange={(e) => setFromDate(e.target.value)}
                                  className="text-xs py-1 px-2 rounded-lg border border-gray-200 bg-[#F8FAFC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0D2C54] cursor-pointer"
                                />
                              </div>
                              <span className="text-gray-400 font-mono text-xs hidden sm:inline">–</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase font-space">To:</span>
                                <input
                                  type="date"
                                  value={toDate}
                                  onChange={(e) => setToDate(e.target.value)}
                                  className="text-xs py-1 px-2 rounded-lg border border-gray-200 bg-[#F8FAFC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0D2C54] cursor-pointer"
                                />
                              </div>
                            </div>
                          )}

                          {dateFilter === 'custom' && (
                            <input
                              type="date"
                              value={customDate}
                              onChange={(e) => setCustomDate(e.target.value)}
                              className="text-xs py-1.5 px-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/20 focus:border-[#0D2C54] cursor-pointer"
                            />
                          )}

                          {/* Date Sort Toggle */}
                          <button
                            type="button"
                            onClick={() => setDateSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-[#F8FAFC] hover:bg-gray-100 text-gray-700 font-semibold text-xs cursor-pointer transition-colors shadow-2xs"
                            title={`Click to sort by date (${dateSortOrder === 'desc' ? 'Newest First' : 'Oldest First'})`}
                          >
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>{dateSortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
                          </button>
                        </div>

                        <div className="h-4 w-px bg-gray-200 hidden md:block" />

                        {/* FILTER OPTION 2: COURSE TYPE DROPDOWN */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1.5 text-gray-700 font-bold uppercase text-[11px] tracking-wider font-space">
                            <Filter className="w-3.5 h-3.5 text-[#0D2C54]" />
                            <span>Course Type:</span>
                          </div>
                          <select
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            className="text-xs py-1.5 px-3 rounded-xl border border-gray-200 bg-[#F8FAFC] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/20 focus:border-[#0D2C54] cursor-pointer max-w-[260px] truncate"
                          >
                            <option value="all">All Courses ({inquiries.length})</option>
                            {courseOptionsWithCounts.map(({ name, count }) => (
                              <option key={name} value={name}>
                                {name} ({count})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Reset Filters Button */}
                      <button
                        onClick={handleResetFilters}
                        disabled={!isFilteredActive}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-space uppercase tracking-wider transition-all cursor-pointer ${
                          isFilteredActive
                            ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 shadow-xs'
                            : 'bg-gray-100 text-gray-400 border border-gray-200 opacity-60 cursor-not-allowed'
                        }`}
                        title={isFilteredActive ? "Reset all search & filter settings to default" : "No filters active"}
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${isFilteredActive ? 'text-red-600' : 'text-gray-400'}`} />
                        <span>Reset Filters</span>
                      </button>

                    </div>
                  </div>

                  {/* Leads Container (Optimized for Mobile Device View & Desktop) */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                    
                    {/* Top Device Bar */}
                    <div className="px-4 py-2.5 bg-gray-50/90 border-b border-gray-200 flex items-center justify-between text-[11px] text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0D2C54] uppercase tracking-wider font-space">
                          {totalLeads} {totalLeads === 1 ? 'Lead' : 'Leads'}
                        </span>
                        {isFilteredActive && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                            Filtered
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-gray-500">
                        Page {safeCurrentPage} of {totalPages}
                      </span>
                    </div>

                    {/* DEVICE VIEW (Mobile Phones & Tablets - < md screens): Clean Touch-Friendly Cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                      {paginatedInquiries.map((item) => (
                        <div key={item.id} className="p-4 space-y-3 hover:bg-blue-50/20 transition-colors">
                          {/* Card Header: Avatar, Name, Type, and Status Dropdown */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0D2C54] font-bold text-xs flex items-center justify-center shrink-0">
                                {(item.fullName || 'A').charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-sm text-gray-900 truncate">{item.fullName}</h4>
                                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase font-space bg-gray-100 text-gray-600">
                                  {item.formType || 'Inquiry'}
                                </span>
                              </div>
                            </div>

                            <select
                              value={item.status}
                              onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                              className={`text-[11px] font-bold font-space uppercase px-2 py-1 rounded-lg border focus:outline-none cursor-pointer shrink-0 ${
                                item.status === 'New'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : item.status === 'Contacted'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Enrolled">Enrolled</option>
                            </select>
                          </div>

                          {/* Card Body: Course Badge & Date */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium text-[11px]">
                              <span>{normalizeCourseName(item.course)}</span>
                            </div>

                            <div className="flex items-center gap-1 text-gray-400 text-[11px] font-mono">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span>
                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                }) : 'Recent'}
                                {item.createdAt && ` • ${new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                              </span>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                            <a
                              href={`tel:${item.phone}`}
                              className="flex items-center gap-2 text-gray-800 font-mono hover:text-blue-600 bg-gray-50 px-2.5 py-1.5 rounded-lg"
                            >
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span>{item.phone}</span>
                            </a>
                            {item.email && (
                              <a
                                href={`mailto:${item.email}`}
                                className="flex items-center gap-2 text-gray-600 truncate hover:text-blue-600 bg-gray-50 px-2.5 py-1.5 rounded-lg"
                              >
                                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="truncate">{item.email}</span>
                              </a>
                            )}
                          </div>

                          {/* Message snippet if present */}
                          {item.message && (
                            <p className="text-[11px] text-gray-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/60 line-clamp-2">
                              "{item.message}"
                            </p>
                          )}

                          {/* Card Action Buttons */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                            <button
                              onClick={() => setSelectedLead(item)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>

                            <a
                              href={`https://wa.me/91${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${item.fullName}, Greetings from D'code IAS Academy!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>

                            <button
                              onClick={() => handleDeleteLead(item.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* DESKTOP VIEW (>= md screens): Full Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-space uppercase text-gray-500 font-bold tracking-wider">
                            <th className="py-3 px-4">Student Name</th>
                            <th className="py-3 px-4">Contact Info</th>
                            <th className="py-3 px-4">Course / Program</th>
                            <th className="py-3 px-4">Submission Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {paginatedInquiries.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                              {/* Name */}
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-gray-900 text-sm">{item.fullName}</div>
                                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase font-space bg-gray-100 text-gray-600">
                                  {item.formType || 'Inquiry'}
                                </span>
                              </td>

                              {/* Contact */}
                              <td className="py-3.5 px-4 space-y-1">
                                <div className="flex items-center gap-1.5 font-mono text-gray-800">
                                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                                  <a href={`tel:${item.phone}`} className="hover:text-blue-600">{item.phone}</a>
                                </div>
                                {item.email && (
                                  <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                                    <Mail className="w-3 h-3 text-gray-400" />
                                    <a href={`mailto:${item.email}`} className="hover:text-blue-600 truncate max-w-[160px]">{item.email}</a>
                                  </div>
                                )}
                              </td>

                              {/* Course */}
                              <td className="py-3.5 px-4">
                                <span className="font-medium text-gray-800">{normalizeCourseName(item.course)}</span>
                              </td>

                              {/* Date & Time */}
                              <td className="py-3.5 px-4 text-gray-500 text-[11px] font-mono whitespace-nowrap">
                                {item.createdAt ? (
                                  <div>
                                    <div className="font-semibold text-gray-800">
                                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </div>
                                    <div className="text-[10px] text-gray-400">
                                      {new Date(item.createdAt).toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                      })}
                                    </div>
                                  </div>
                                ) : 'Recent'}
                              </td>

                              {/* Status Select */}
                              <td className="py-3.5 px-4">
                                <select
                                  value={item.status}
                                  onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                                  className={`text-[11px] font-bold font-space uppercase px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                    item.status === 'New'
                                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                                      : item.status === 'Contacted'
                                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  }`}
                                >
                                  <option value="New">New</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Enrolled">Enrolled</option>
                                </select>
                              </td>

                              {/* Action Buttons */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedLead(item)}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-[#0D2C54] hover:bg-gray-100 transition-colors cursor-pointer"
                                    title="View full notes and message"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  <a
                                    href={`https://wa.me/91${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${item.fullName}, Greetings from D'code IAS Academy!`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                    title="WhatsApp Chat"
                                  >
                                    <Send className="w-4 h-4" />
                                  </a>

                                  <button
                                    onClick={() => handleDeleteLead(item.id)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Delete record"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </div>

                    {/* Empty State */}
                    {totalLeads === 0 && (
                      <div className="py-12 text-center text-gray-400 p-4">
                        <div className="space-y-2.5">
                          <p className="font-medium text-gray-500">No student records found matching your current filter criteria.</p>
                          {isFilteredActive && (
                            <button
                              onClick={handleResetFilters}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D2C54] hover:bg-[#D31218] text-white text-xs font-semibold font-space uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset Filters & View All ({inquiries.length})</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Universal Responsive Pagination Bar */}
                    {totalLeads > 0 && (
                      <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        {/* Page count info & Page Size selector */}
                        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                          <span className="text-gray-600 font-medium">
                            Showing <span className="font-bold text-gray-900 font-mono">{startIndex + 1}</span>–<span className="font-bold text-gray-900 font-mono">{endIndex}</span> of <span className="font-bold text-gray-900 font-mono">{totalLeads}</span>
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-[11px] hidden xs:inline">Per page:</span>
                            <select
                              value={pageSize}
                              onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                              }}
                              className="py-1 px-2 rounded-lg border border-gray-200 bg-white font-mono text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0D2C54] cursor-pointer"
                            >
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                          </div>
                        </div>

                        {/* Page navigation buttons */}
                        <div className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={safeCurrentPage <= 1}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-medium text-xs transition-colors ${
                              safeCurrentPage <= 1
                                ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                                : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300 shadow-2xs cursor-pointer'
                            }`}
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Prev</span>
                          </button>

                          <div className="flex items-center gap-1">
                            {getPageNumbers().map((page, idx) =>
                              typeof page === 'number' ? (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentPage(page)}
                                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                    safeCurrentPage === page
                                      ? 'bg-[#0D2C54] text-white shadow-xs'
                                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                                  }`}
                                >
                                  {page}
                                </button>
                              ) : (
                                <span key={idx} className="w-5 text-center text-gray-400 select-none">
                                  {page}
                                </span>
                              )
                            )}
                          </div>

                          <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={safeCurrentPage >= totalPages}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-medium text-xs transition-colors ${
                              safeCurrentPage >= totalPages
                                ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                                : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300 shadow-2xs cursor-pointer'
                            }`}
                          >
                            <span>Next</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: UPCOMING BATCHES SCHEDULE MANAGER                 */}
              {/* ======================================================== */}
              {activeTab === 'batches' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0D2C54]">
                        Upcoming Batches Schedule Manager
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage all batch admissions, dates, commute modes, and real-time seat availability displayed on the website.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetBatches}
                        className="px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-600 text-xs font-space font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        title="Restore initial 3 batches"
                      >
                        Reset Defaults
                      </button>
                      <button
                        onClick={handleOpenCreateBatch}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D31218] hover:bg-[#A30D12] text-white text-xs font-bold uppercase font-space tracking-wider shadow-sm transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create New Batch</span>
                      </button>
                    </div>
                  </div>

                  {/* Batch Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {batches.map((batch) => (
                      <div
                        key={batch.id}
                        className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
                      >
                        {/* Top Availability Tag */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-space uppercase tracking-widest text-gray-400 block">
                              Batch Program
                            </span>
                            <h4 className="font-serif font-bold text-base text-[#0D2C54] mt-0.5">
                              {batch.name}
                            </h4>
                          </div>

                          <button
                            onClick={() => handleToggleBatchStatus(batch)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-space font-bold uppercase tracking-wider border cursor-pointer ${
                              batch.availability === 'Closed' ? 'bg-red-50 text-red-700 border-red-200' :
                              batch.availability === 'Coming Soon' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              batch.availability === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              'bg-purple-50 text-purple-700 border-purple-200'
                            }`}
                            title="Click to cycle status"
                          >
                            {batch.availability}
                          </button>
                        </div>

                        {/* Batch Meta */}
                        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-gray-100 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Commencing:</span>
                            <span className="font-bold text-gray-900 font-mono">{batch.startDate}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Delivery Mode:</span>
                            <span className="font-semibold text-blue-700">{batch.mode}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Enroll Button:</span>
                            <span className={`font-bold ${batch.availability === 'Closed' || batch.availability === 'Coming Soon' ? 'text-gray-400' : 'text-emerald-600'}`}>
                              {batch.availability === 'Closed' || batch.availability === 'Coming Soon' ? 'Disabled on site' : 'Active (Enroll Now)'}
                            </span>
                          </div>
                        </div>

                        {/* Batch Controls */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <button
                            onClick={() => handleToggleBatchStatus(batch)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                          >
                            Cycle Status
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditBatch(batch)}
                              className="p-1.5 rounded-lg text-gray-600 hover:text-[#0D2C54] hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Edit batch details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBatch(batch.id, batch.name)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete batch"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {batches.length === 0 && (
                    <div className="py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-200">
                      No batch schedules found. Click "Create New Batch" to add one.
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: SYSTEM & LOGS                                     */}
              {/* ======================================================== */}
                            {/* ======================================================== */}
              {/* TAB: COLOR PALETTE CUSTOMIZER                           */}
              {/* ======================================================== */}
              {activeTab === 'palette' && (
                <AdminColorPalette />
              )}

{activeTab === 'system' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0D2C54]">
                      System Health & Security Logs
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Operational metrics, Firebase Firestore status, and active authentication session.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Active Session Info */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#0D2C54]">
                        <Shield className="w-4 h-4 text-[#D31218]" />
                        <span>Administrator Session</span>
                      </div>
                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <span>Email:</span>
                          <span className="font-bold text-gray-900">{session?.admin?.email || 'admin@decodeias.com'}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <span>Role:</span>
                          <span className="font-semibold text-purple-700 font-mono">Master Admin</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <span>Login Time:</span>
                          <span className="font-mono text-gray-800">{session?.admin?.loginTime ? new Date(session.admin.loginTime).toLocaleString() : 'Active'}</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span>Token Expiry:</span>
                          <span className="text-emerald-600 font-semibold">24-Hour Guard Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Database & Cloud Function Status */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#0D2C54]">
                        <Database className="w-4 h-4 text-emerald-600" />
                        <span>Database Connectivity</span>
                      </div>
                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <span>Firestore:</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Connected
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <span>Project:</span>
                          <span className="font-mono text-gray-800">d-code-ias (Firebase)</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <span>Local Storage Fallback:</span>
                          <span className="text-blue-600 font-semibold">Enabled (Dual-Write)</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span>Email Dispatcher:</span>
                          <span className="text-emerald-600 font-semibold">Active (student & counselor alerts)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>

        {/* CSV Spreadsheet Preview & Direct View Modal (Mobile & Desktop Viewable) */}
      <AnimatePresence>
        {isCsvPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-5xl bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] flex flex-col"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-[#0D2C54]">
                      Leads Export Spreadsheet Preview
                    </h4>
                    <p className="text-xs text-gray-500">
                      Showing {filteredInquiries.length} leads under current filter criteria
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handleCopyCsvToClipboard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold font-space uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy CSV'}</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D2C54] hover:bg-[#D31218] text-white text-xs font-bold font-space uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                    title="Directly download CSV file to Downloads folder"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>

                  <button
                    onClick={() => setIsCsvPreviewOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Table Container for full view */}
              <div className="flex-1 overflow-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 sticky top-0 border-b border-gray-200 text-[10px] font-space uppercase text-gray-500 font-bold tracking-wider">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3">Full Name</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Course</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInquiries.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2 px-3 font-mono text-[11px] text-gray-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap text-gray-600">
                          {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : 'N/A'}
                        </td>
                        <td className="py-2 px-3 font-bold text-gray-900 whitespace-nowrap">{item.fullName}</td>
                        <td className="py-2 px-3 font-mono text-gray-700 whitespace-nowrap">{item.phone}</td>
                        <td className="py-2 px-3 text-gray-600">{item.email || '-'}</td>
                        <td className="py-2 px-3 font-medium text-blue-700 whitespace-nowrap">{normalizeCourseName(item.course)}</td>
                        <td className="py-2 px-3 uppercase text-[10px] font-space font-bold text-gray-500">{item.formType || 'contact'}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-space uppercase ${
                            item.status === 'New' ? 'bg-amber-100 text-amber-800' :
                            item.status === 'Contacted' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-600 max-w-[250px] truncate" title={item.message}>
                          {item.message || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 text-[11px] text-gray-400 flex items-center justify-between">
                <span>Tip: Tap "Copy CSV" to paste directly into Google Sheets or WhatsApp.</span>
                <span className="font-mono font-bold text-gray-700">{filteredInquiries.length} rows</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Download Success Toast Notification */}
      <AnimatePresence>
        {downloadSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 right-5 z-50 bg-[#0D2C54] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs max-w-md border border-white/10"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex-1">{downloadSuccessToast}</div>
            <button
              onClick={() => {
                setIsCsvPreviewOpen(true);
                setDownloadSuccessToast(null);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-[11px] shrink-0 cursor-pointer"
            >
              View Sheet
            </button>
            <button
              onClick={() => setDownloadSuccessToast(null)}
              className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0D2C54] font-bold text-xs flex items-center justify-center">
                    {selectedLead.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0D2C54]">{selectedLead.fullName}</h4>
                    <p className="text-[10px] text-gray-400 font-mono">ID: {selectedLead.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Phone</p>
                    <a href={`tel:${selectedLead.phone}`} className="font-bold text-gray-900 mt-0.5 block hover:text-blue-600">
                      {selectedLead.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Email</p>
                    <p className="font-bold text-gray-900 mt-0.5 truncate">{selectedLead.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Course / Interest</p>
                    <p className="font-bold text-blue-700 mt-0.5">{normalizeCourseName(selectedLead.course)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Form Type</p>
                    <p className="font-bold text-purple-700 mt-0.5 uppercase">{selectedLead.formType || 'Inquiry'}</p>
                  </div>
                </div>

                {selectedLead.message && (
                  <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60">
                    <p className="text-amber-800 text-[10px] uppercase font-bold mb-1">Student Message / Query</p>
                    <p className="text-gray-800 leading-relaxed">{selectedLead.message}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-gray-500 font-bold uppercase text-[10px]">Update Lead Status:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as any;
                      handleStatusChange(selectedLead.id, newStatus);
                      setSelectedLead({ ...selectedLead, status: newStatus });
                    }}
                    className="text-xs font-bold font-space uppercase px-3 py-1.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Enrolled">Enrolled</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create / Edit Batch Modal */}
        {isBatchModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="font-bold text-base text-[#0D2C54]">
                  {editingBatch ? 'Edit Batch Schedule' : 'Create New Batch'}
                </h4>
                <button
                  onClick={() => setIsBatchModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBatchSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Batch Name / Title *</label>
                  <input
                    type="text"
                    required
                    value={batchFormData.name}
                    onChange={(e) => setBatchFormData({ ...batchFormData, name: e.target.value })}
                    placeholder="e.g. Mains Momentum 2027 or PCM Comprehensive"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Commencing / Start Date *</label>
                  <input
                    type="text"
                    required
                    value={batchFormData.startDate}
                    onChange={(e) => setBatchFormData({ ...batchFormData, startDate: e.target.value })}
                    placeholder="e.g. 15th Oct, 2026 or 01st Nov, 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Commute / Delivery Mode</label>
                  <select
                    value={batchFormData.mode}
                    onChange={(e) => setBatchFormData({ ...batchFormData, mode: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/20 bg-white"
                  >
                    <option value="Offline + Online">Offline + Online</option>
                    <option value="Offline Only">Offline Only</option>
                    <option value="Online Exclusive">Online Exclusive</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Seat Availability Status</label>
                  <select
                    value={batchFormData.availability}
                    onChange={(e) => setBatchFormData({ ...batchFormData, availability: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/20 bg-white"
                  >
                    <option value="Coming Soon">Coming Soon (Button Disabled)</option>
                    <option value="Closed">Closed (Button Disabled)</option>
                    <option value="Open">Open (Enroll Now Enabled)</option>
                    <option value="Limited Seats">Limited Seats (Enroll Now Enabled)</option>
                    <option value="Last 5 Seats">Last 5 Seats (Enroll Now Enabled)</option>
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">
                    *Note: "Closed" and "Coming Soon" automatically disable the Enroll button on the website.
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBatchModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0D2C54] hover:bg-[#D31218] text-white text-xs font-bold uppercase font-space tracking-wider shadow-sm transition-colors cursor-pointer"
                  >
                    {editingBatch ? 'Update Batch' : 'Create Batch'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

    </div>
  );

  if (isPage) {
    return dashboardContent;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-2 sm:p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[1440px] h-[95vh] flex flex-col overflow-hidden"
        >
          {dashboardContent}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
