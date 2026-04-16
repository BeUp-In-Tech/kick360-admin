"use client";

import React, { useState } from 'react';
import { X, FileText, FileSpreadsheet, FileIcon, Info, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [format, setFormat] = useState('PDF');
  const [isExporting, setIsExporting] = useState(false);
  const [columns, setColumns] = useState({
    userName: true,
    email: false,
    country: false,
    sessions: true,
    status: true,
    joinDate: true
  });

  if (!isOpen) return null;

  const toggleColumn = (key: keyof typeof columns) => {
    setColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // The backend returns a JSON payload (or mock message) for these endpoints
      const endpoint = format === 'PDF' 
        ? '/api/admin/analytics/export-pdf/' 
        : '/api/admin/overview/export-excel/';
      
      const result = await fetchApi(endpoint);
      
      // Since the backend currently returns JSON, we will download the JSON data as a file
      // to satisfy the local saving requirement until true file streams are implemented.
      const jsonString = JSON.stringify(result, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      // Saving as .json for now to perfectly preserve the data structure provided by backend
      a.download = `kick360_export_${format.toLowerCase()}_data.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      alert(`${format} export generated successfully!`);
      onClose();
    } catch (error) {
      console.error(`Failed to export ${format}:`, error);
      alert("Export failed. Ensure the server endpoint is active.");
    } finally {
      setIsExporting(false);
    }
  };

  const FormatOption = ({ id, icon, label }: { id: string, icon: React.ReactNode, label: string }) => {
    const isSelected = format === id;
    
    return (
      <button
        onClick={() => setFormat(id)}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '24px 16px',
          backgroundColor: isSelected ? 'var(--background)' : 'var(--surface-primary)',
          border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
          borderRadius: '12px',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <div style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
          {icon}
        </div>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>{label}</span>
      </button>
    );
  };

  const CheckboxItem = ({ id, label, checked }: { id: keyof typeof columns, label: string, checked: boolean }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        backgroundColor: checked ? 'var(--text-primary)' : 'transparent',
        border: '1px solid var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s'
      }}>
        {checked && <div style={{ color: 'var(--background)' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>}
      </div>
      <input 
        type="checkbox" 
        style={{ display: 'none' }} 
        checked={checked}
        onChange={() => toggleColumn(id)}
      />
      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{label}</span>
    </label>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'var(--background)',
        width: '100%',
        maxWidth: '600px',
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--border-color)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '32px 32px 24px 32px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Export user Data</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Format Selection */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0', letterSpacing: '0.5px' }}>
              Select Format
            </h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <FormatOption id="Excel" label="Excel" icon={<FileSpreadsheet size={28} />} />
              <FormatOption id="PDF" label="PDF" icon={<FileIcon size={28} />} />
            </div>
          </div>

          {/* Data Range */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0', letterSpacing: '0.5px' }}>
              Data Range
            </h3>
            <select style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'var(--surface-primary)',
              color: 'var(--text-primary)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '16px'
            }}>
              <option>All Time</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>

          {/* Columns */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0', letterSpacing: '0.5px' }}>
              Columns To Include
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <CheckboxItem id="userName" label="User Name" checked={columns.userName} />
              <CheckboxItem id="email" label="Email" checked={columns.email} />
              <CheckboxItem id="country" label="Country" checked={columns.country} />
              <CheckboxItem id="sessions" label="Sessions" checked={columns.sessions} />
              <CheckboxItem id="status" label="Status" checked={columns.status} />
              <CheckboxItem id="joinDate" label="Join Date" checked={columns.joinDate} />
            </div>
          </div>

          {/* Info Banner */}
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            padding: '16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'var(--text-secondary)'
          }}>
            <Info size={20} />
            <span style={{ fontSize: '14px' }}>
              Approx. <strong style={{ color: 'var(--text-primary)' }}>1,240</strong> records will be exported.
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{
          backgroundColor: 'var(--surface-primary)',
          padding: '24px 32px',
          display: 'flex',
          gap: '16px'
        }}>
          <Button variant="outline" fullWidth onClick={onClose} style={{
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '15px',
            padding: '16px',
            height: 'auto'
          }}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleExport} disabled={isExporting} style={{ 
            backgroundColor: '#ffffff', 
            color: '#000000', 
            border: 'none', 
            display: 'flex', 
            gap: '8px',
            fontSize: '15px',
            padding: '16px',
            height: 'auto',
            opacity: isExporting ? 0.7 : 1
          }}>
            <Download size={20} />
            {isExporting ? "Exporting..." : "Export Datasheet"}
          </Button>
        </div>

      </div>
    </div>
  );
}
