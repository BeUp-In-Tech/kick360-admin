"use client";

import { useState } from "react";
import { Search, Filter, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { UserTable } from "@/components/users/UserTable";

export default function UsersPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
            User Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
            Manage and monitor all registered users globally.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '320px' }}>
            <Input 
              type="text" 
              placeholder="Search users, tournaments..." 
              icon={<Search size={18} />} 
              style={{
                backgroundColor: 'var(--surface-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '10px 16px 10px 44px',
                borderRadius: '8px',
                width: '100%',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: isFilterOpen ? 'var(--surface-primary)' : 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            onMouseOver={(e) => { if (!isFilterOpen) e.currentTarget.style.backgroundColor = 'var(--surface-secondary)' }}
            onMouseOut={(e) => { if (!isFilterOpen) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <Filter size={16} />
              Filters
            </button>

            {/* Calendar Filter Popover */}
            {isFilterOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '12px',
                  width: '280px',
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                  zIndex: 50,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                  <CalendarIcon size={18} />
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Filter by Date</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>From</label>
                    <input 
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--background)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        outline: 'none',
                        colorScheme: 'dark' // Helps style the native date picker on some browsers
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>To</label>
                    <input 
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--background)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        outline: 'none',
                        colorScheme: 'dark'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
                  <button 
                    onClick={() => { setDateRange({start: '', end: ''}); setIsFilterOpen(false); }}
                    style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    style={{ padding: '6px 16px', borderRadius: '6px', backgroundColor: 'var(--text-primary)', border: 'none', color: 'var(--background)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <UserTable />
    </div>
  );
}
