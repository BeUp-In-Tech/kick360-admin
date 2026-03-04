"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { AccessCodeTable } from "@/components/access-codes/AccessCodeTable";
import { ManageCodeModal } from "@/components/access-codes/ManageCodeModal";

export default function AccessCodesPage() {
  const [selectedCode, setSelectedCode] = useState<any | null>(null);

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
            Access Code Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
            Generate and manage access codes for platform services.
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
        </div>
      </div>

      {/* Main Content */}
      <AccessCodeTable onManageCode={(code) => setSelectedCode(code)} />

      {/* Modal */}
      <ManageCodeModal 
        isOpen={!!selectedCode} 
        onClose={() => setSelectedCode(null)} 
        codeData={selectedCode} 
      />
    </div>
  );
}
