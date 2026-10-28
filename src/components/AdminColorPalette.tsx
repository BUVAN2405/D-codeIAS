import React, { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  RotateCcw,
  Save,
  Undo2,
  Check,
  AlertCircle,
  Eye,
  Sparkles,
  Layers,
  Type,
  MousePointerClick,
  Monitor,
  CheckCircle2,
  HelpCircle,
  X
} from 'lucide-react';
import {
  ColorPalette,
  DEFAULT_PALETTE,
  COLOR_FIELDS_METADATA,
  PALETTE_VAR_MAP,
  isValidHex,
  normalizeHex,
  applyPaletteToDom,
  getCachedPalette,
  ColorFieldMeta
} from '../theme/palette';
import { fetchPaletteApi, savePaletteApi, resetPaletteApi } from '../services/api';

export default function AdminColorPalette() {
  const [palette, setPalette] = useState<ColorPalette>(getCachedPalette);
  const [savedPalette, setSavedPalette] = useState<ColorPalette>(getCachedPalette);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePickerKey, setActivePickerKey] = useState<keyof ColorPalette | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [livePreviewOnSite, setLivePreviewOnSite] = useState(true);

  const pickerRef = useRef<HTMLDivElement>(null);

  // Close color picker popup on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setActivePickerKey(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch initial palette on mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchPaletteApi()
      .then((data) => {
        if (isMounted) {
          setPalette(data);
          setSavedPalette(data);
          applyPaletteToDom(data);
        }
      })
      .catch((err) => {
        console.warn('[PALETTE] Failed to load remote palette:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync DOM with live working palette if live preview is enabled
  useEffect(() => {
    if (livePreviewOnSite) {
      applyPaletteToDom(palette);
    }
  }, [palette, livePreviewOnSite]);

  // Check if any color differs from the saved state
  const hasUnsavedChanges = JSON.stringify(palette) !== JSON.stringify(savedPalette);

  // Handle color change from react-colorful or input
  const handleColorChange = (key: keyof ColorPalette, value: string) => {
    setPalette((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle blur / normalize on text input
  const handleInputBlur = (key: keyof ColorPalette) => {
    const raw = palette[key];
    if (isValidHex(raw)) {
      handleColorChange(key, normalizeHex(raw));
    } else {
      // Revert to saved or default if invalid
      handleColorChange(key, savedPalette[key] || DEFAULT_PALETTE[key]);
      showNotification('error', `Invalid hex color code entered. Reverted to previous value.`);
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Save Palette
  const handleSave = async () => {
    // Validate all fields
    for (const [key, val] of Object.entries(palette)) {
      if (!isValidHex(val)) {
        showNotification('error', `Invalid hex color for "${key}": "${val}". Please correct it before saving.`);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await savePaletteApi(palette);
      if (res.success && res.palette) {
        setPalette(res.palette);
        setSavedPalette(res.palette);
        applyPaletteToDom(res.palette);
        showNotification('success', 'Color palette saved successfully! The new theme is now live for all visitors.');
      } else {
        showNotification('error', res.error || 'Failed to save color palette.');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Error occurred while saving palette.');
    } finally {
      setSaving(false);
    }
  };

  // Discard Unsaved Changes
  const handleDiscard = () => {
    setPalette(savedPalette);
    applyPaletteToDom(savedPalette);
    setActivePickerKey(null);
    showNotification('info', 'Unsaved changes discarded. Restored previously saved palette.');
  };

  // Reset to Default System Palette
  const handleResetToDefault = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all website colors back to the default D\'code IAS Academy brand palette?'
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      const res = await resetPaletteApi();
      if (res.success && res.palette) {
        setPalette(res.palette);
        setSavedPalette(res.palette);
        applyPaletteToDom(res.palette);
        showNotification('success', 'Palette has been reset to default brand colors.');
      } else {
        showNotification('error', res.error || 'Failed to reset color palette.');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Error resetting palette.');
    } finally {
      setSaving(false);
    }
  };

  // Filter groups
  const groups: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Colors', icon: Palette },
    { id: 'brand', label: 'Brand & Accents', icon: Sparkles },
    { id: 'surfaces', label: 'Layout & Surfaces', icon: Layers },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'buttons', label: 'Buttons (All States)', icon: MousePointerClick },
    { id: 'headerFooter', label: 'Navbar & Footer', icon: Monitor },
    { id: 'feedback', label: 'Feedback & Badges', icon: AlertCircle }
  ];

  const filteredFields = COLOR_FIELDS_METADATA.filter((field) => {
    if (selectedGroup === 'all') return true;
    return field.group === selectedGroup;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D2C54] text-white flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5 text-amber-300" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#0D2C54]">
              Website Color Palette Customizer
            </h1>
          </div>
          <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
            Configure the global semantic color system across the entire D'code IAS website.
            Changes saved here update button styles, cards, navigation bars, text, and alerts in real-time for all website visitors.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={saving || loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
            title="Reset to default brand palette"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges || saving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5 text-gray-500" />
            <span>Discard</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#D31218] hover:bg-[#B91C1C] transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 text-white" />
            )}
            <span>{saving ? 'Saving...' : 'Save Palette'}</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 px-4 flex items-center justify-between text-xs text-amber-900 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-semibold">
                You have unsaved color adjustments.
              </span>
              <span className="text-amber-700 hidden sm:inline">
                Click "Save Palette" above or in the sticky toolbar to publish them live.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDiscard}
                className="underline hover:text-amber-950 font-medium cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 cursor-pointer"
              >
                Save Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 px-4 rounded-xl text-xs font-medium flex items-center gap-2.5 shadow-sm border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : notification.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-300'
              : 'bg-blue-50 text-blue-900 border-blue-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Grid: Controls (Left) & Live Preview (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: Color Pickers by Category (7 Cols)             */}
        {/* ============================================================ */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Category Navigation Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {groups.map((group) => {
              const Icon = group.icon;
              const isActive = selectedGroup === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroup(group.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0D2C54] text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-gray-400'}`} />
                  <span>{group.label}</span>
                </button>
              );
            })}
          </div>

          {/* Color Items Grid */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">
                Showing {filteredFields.length} Color Variables
              </span>
              <label className="inline-flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={livePreviewOnSite}
                  onChange={(e) => setLivePreviewOnSite(e.target.checked)}
                  className="rounded text-[#D31218] focus:ring-[#D31218]"
                />
                <span>Live update whole page while editing</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative">
              {filteredFields.map((field) => {
                const currentColor = palette[field.key];
                const isDefault = currentColor.toUpperCase() === DEFAULT_PALETTE[field.key].toUpperCase();
                const isPickerOpen = activePickerKey === field.key;

                return (
                  <div
                    key={field.key}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isPickerOpen
                        ? 'border-[#0D2C54] ring-2 ring-[#0D2C54]/10 bg-slate-50/50 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-bold text-gray-900 truncate block">
                            {field.label}
                          </label>
                          {!isDefault && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Modified from default" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5">
                          {field.description}
                        </p>
                      </div>

                      {/* Single field reset */}
                      {!isDefault && (
                        <button
                          type="button"
                          onClick={() => handleColorChange(field.key, DEFAULT_PALETTE[field.key])}
                          className="text-[10px] text-gray-400 hover:text-gray-700 underline shrink-0 cursor-pointer"
                          title="Reset to default color"
                        >
                          Default
                        </button>
                      )}
                    </div>

                    {/* Color Swatch & Hex Input Row */}
                    <div className="flex items-center gap-2.5">
                      {/* Swatch Button */}
                      <button
                        type="button"
                        onClick={() => setActivePickerKey(isPickerOpen ? null : field.key)}
                        style={{ backgroundColor: currentColor }}
                        className="w-10 h-10 rounded-xl border border-black/15 shadow-inner shrink-0 relative transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center group"
                        title="Click to open color picker"
                      >
                        <Palette className="w-4 h-4 text-white drop-shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      {/* Hex Text Field */}
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => handleColorChange(field.key, e.target.value)}
                          onBlur={() => handleInputBlur(field.key)}
                          maxLength={7}
                          className="w-full font-mono text-xs font-bold uppercase py-2 px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#0D2C54] focus:ring-1 focus:ring-[#0D2C54] text-gray-800 tracking-wider bg-gray-50/50"
                        />
                      </div>

                      {/* Quick Default Swatch preview */}
                      <button
                        type="button"
                        onClick={() => handleColorChange(field.key, DEFAULT_PALETTE[field.key])}
                        style={{ backgroundColor: DEFAULT_PALETTE[field.key] }}
                        className="w-6 h-6 rounded-md border border-black/10 shrink-0 cursor-pointer opacity-75 hover:opacity-100"
                        title={`Default: ${DEFAULT_PALETTE[field.key]}`}
                      />
                    </div>

                    {/* Floating Color Picker Popover */}
                    {isPickerOpen && (
                      <div
                        ref={pickerRef}
                        className="mt-3 p-3 bg-white rounded-2xl border border-gray-300 shadow-xl z-30 space-y-2.5"
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-gray-100 text-xs">
                          <span className="font-semibold text-gray-700">Choose Color</span>
                          <button
                            type="button"
                            onClick={() => setActivePickerKey(null)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* React-Colorful Hex Picker */}
                        <div className="custom-color-picker">
                          <HexColorPicker
                            color={currentColor}
                            onChange={(newHex) => handleColorChange(field.key, newHex)}
                          />
                        </div>

                        {/* Quick Color Presets */}
                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <span className="text-gray-400">Presets:</span>
                          <div className="flex items-center gap-1.5">
                            {['#D31218', '#0D2C54', '#F59E0B', '#10B981', '#FFFFFF', '#081B34'].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => handleColorChange(field.key, preset)}
                                style={{ backgroundColor: preset }}
                                className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                                title={preset}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Interactive Live Preview Card (5 Cols)         */}
        {/* ============================================================ */}
        <div className="xl:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            
            {/* Preview Card Title Header */}
            <div className="p-4 px-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#D31218]" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 font-space">
                  Live Component Preview
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">
                Updates dynamically
              </span>
            </div>

            {/* Simulated Website UI Canvas */}
            <div
              className="p-5 space-y-5 transition-colors duration-200"
              style={{ backgroundColor: palette.background }}
            >
              
              {/* 1. Simulated Navbar */}
              <div
                className="p-3.5 rounded-xl shadow-xs flex items-center justify-between transition-colors duration-200 border"
                style={{
                  backgroundColor: palette.navbarBg,
                  color: palette.navbarText,
                  borderColor: 'rgba(255,255,255,0.1)'
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-serif font-black text-xs"
                    style={{ backgroundColor: palette.primary, color: palette.btnPrimaryText }}
                  >
                    D
                  </div>
                  <div className="leading-tight">
                    <span className="font-serif font-bold text-xs block">D'code IAS</span>
                    <span className="text-[8px] opacity-75 font-mono uppercase tracking-wider block">Academy</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold opacity-90 hidden sm:inline">Home</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: palette.tertiary }}
                  >
                    Courses
                  </span>
                  <button
                    type="button"
                    style={{
                      backgroundColor: palette.btnPrimaryBg,
                      color: palette.btnPrimaryText
                    }}
                    className="text-[9px] font-bold uppercase px-2.5 py-1 rounded shadow-xs"
                  >
                    Inquire
                  </button>
                </div>
              </div>

              {/* 2. Simulated Hero Typography & Badges */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: palette.surface, color: palette.primary, borderColor: palette.border }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: palette.primary }} />
                  Target UPSC CSE 2027–2028
                </div>

                <h2
                  className="font-serif text-lg font-bold leading-snug"
                  style={{ color: palette.textHeading }}
                >
                  Premier Civil Services Coaching Under Sudhagaran Sir
                </h2>

                <p
                  className="text-xs leading-relaxed"
                  style={{ color: palette.textBody }}
                >
                  Systematic foundation curriculum, daily answer evaluations, and personalized guidance to crack the UPSC exam.
                </p>

                <p className="text-[11px]" style={{ color: palette.textMuted }}>
                  Anna Nagar, Chennai • Offline & Online Batches
                </p>
              </div>

              {/* 3. Simulated Action Buttons (Primary, Secondary, Special) */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block font-mono">
                  Button Variants (Live Colors)
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Primary Button */}
                  <button
                    type="button"
                    style={{
                      backgroundColor: palette.btnPrimaryBg,
                      color: palette.btnPrimaryText
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
                  >
                    Primary Button
                  </button>

                  {/* Secondary Button */}
                  <button
                    type="button"
                    style={{
                      backgroundColor: palette.btnSecondaryBg,
                      color: palette.btnSecondaryText
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
                  >
                    Secondary
                  </button>

                  {/* Special Button */}
                  <button
                    type="button"
                    style={{
                      backgroundColor: palette.btnSpecialBg,
                      color: palette.btnSpecialText
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
                  >
                    Special Button
                  </button>
                </div>
              </div>

              {/* 4. Simulated Content Card */}
              <div
                className="p-4 rounded-xl border transition-colors shadow-xs space-y-2.5"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: palette.secondary, color: '#FFFFFF' }}
                  >
                    Foundation Course
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: palette.primary }}
                  >
                    ₹1,16,000
                  </span>
                </div>

                <h3
                  className="font-serif font-bold text-sm"
                  style={{ color: palette.textHeading }}
                >
                  UPSC Prelims-Cum-Mains 2028
                </h3>

                <p
                  className="text-xs leading-relaxed"
                  style={{ color: palette.textBody }}
                >
                  Comprehensive 1.5-year roadmap with 43 tests, daily 3-hour classes, and continuous mentoring.
                </p>

                <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: palette.border }}>
                  <span
                    className="text-xs font-bold hover:underline cursor-pointer"
                    style={{ color: palette.textLink }}
                  >
                    Learn More →
                  </span>
                  <span className="text-[10px]" style={{ color: palette.textMuted }}>
                    Starts Nov 2026
                  </span>
                </div>
              </div>

              {/* 5. Feedback State Badges */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block font-mono">
                  System Feedback Badges
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    className="py-1 px-2 rounded-lg text-center text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: palette.success }}
                  >
                    Success
                  </div>
                  <div
                    className="py-1 px-2 rounded-lg text-center text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: palette.warning }}
                  >
                    Warning
                  </div>
                  <div
                    className="py-1 px-2 rounded-lg text-center text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: palette.danger }}
                  >
                    Danger
                  </div>
                </div>
              </div>

              {/* 6. Simulated Footer */}
              <div
                className="p-3.5 rounded-xl transition-colors duration-200 border text-center space-y-1"
                style={{
                  backgroundColor: palette.footerBg,
                  color: palette.footerText,
                  borderColor: 'rgba(255,255,255,0.08)'
                }}
              >
                <p className="text-[11px] font-bold">D'code IAS Academy • Chennai</p>
                <p className="text-[9px] opacity-75">
                  © 2026 All Rights Reserved • Privacy Policy • Terms & Conditions
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

