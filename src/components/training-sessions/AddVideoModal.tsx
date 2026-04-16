"use client";

import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddVideoModal({ isOpen, onClose, onSuccess }: AddVideoModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    Select_category: "",
    Title: "",
    Subtitle: "",
    Equipment_used: "",
    Steps: "",
    Time: "",
    Points: ""
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      // Reset form
      setFormData({
        Select_category: "",
        Title: "",
        Subtitle: "",
        Equipment_used: "",
        Steps: "",
        Time: "",
        Points: ""
      });
      setVideoFile(null);
      setNewCategoryName("");
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const response = await fetchApi('/api/admin/videos/categories/');
      if (response && response.results) {
        setCategories(response.results);
      } else if (Array.isArray(response)) {
        setCategories(response);
      }
    } catch (e) {
      console.error("Failed to load categories", e);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsAddingCategory(true);
    try {
      await fetchApi('/api/admin/videos/categories/', {
        method: 'POST',
        data: { title: newCategoryName, is_active: true }
      });
      setNewCategoryName("");
      alert("Category added successfully!");
      loadCategories(); // reload dropdown
    } catch (e) {
      console.error("Failed to add category", e);
      alert(`Failed to add category: ${e}`);
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.Title || !formData.Select_category) {
      alert("Category and Title are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Use standard fetch specifically for multipart/form-data because fetchApi uses application/json 
      // AND we need to attach the token if required.
      const Form = new FormData();
      Form.append("Select_category", formData.Select_category);
      Form.append("Title", formData.Title);
      Form.append("Subtitle", formData.Subtitle);
      Form.append("Equipment_used", formData.Equipment_used);
      Form.append("Steps", formData.Steps);
      Form.append("Time", formData.Time);
      Form.append("Points", formData.Points || "0");
      Form.append("is_pulished", "true"); // Typo from user docs included!
      
      if (videoFile) {
        Form.append("video", videoFile);
      }

      // To send FormData, we bypass json conversion but append the Auth headers
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/admin/videos/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: Form
      });

      if (!response.ok) {
        const errObj = await response.json().catch(() => null);
        throw new Error(errObj ? JSON.stringify(errObj) : `Server returned ${response.status}`);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error("Failed to upload video", e);
      alert(`Failed to upload video: ${e}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
        maxWidth: '640px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '32px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Add New Video
          </h2>
          <button onClick={onClose} disabled={isSubmitting} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Add New Category Section */}
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
          }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
              Add New Category
            </label>
            <input 
              type="text" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter New Category" 
              style={{
                width: '100%',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '14px 16px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                marginBottom: '16px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleAddCategory}
                disabled={isAddingCategory || !newCategoryName.trim()}
                style={{
                padding: '10px 24px',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                opacity: (isAddingCategory || !newCategoryName.trim()) ? 0.5 : 1
              }}>
                {isAddingCategory ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--surface-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Video Category
              </label>
              <select 
                name="Select_category"
                value={formData.Select_category}
                onChange={handleChange}
                style={{
                width: '100%',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '14px 16px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px top 50%',
                backgroundSize: '10px auto'
              }}>
                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat.id || cat.title} value={cat.title}>{cat.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Video Title
              </label>
              <input 
                name="Title"
                value={formData.Title}
                onChange={handleChange}
                type="text" 
                placeholder="Enter video title..." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Equipment Used
              </label>
              <input 
                name="Equipment_used"
                value={formData.Equipment_used}
                onChange={handleChange}
                type="text" 
                placeholder="Enter Required Equipment.." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Steps
              </label>
              <input 
                name="Steps"
                value={formData.Steps}
                onChange={handleChange}
                type="text" 
                placeholder="Describe Training Step..." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Upload Video Area */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
              Upload Video
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleFileChange}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 2
                }}
              />
              <div style={{
                border: '1px dashed var(--border-color)',
                borderRadius: '16px',
                padding: '48px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.02)',
                transition: 'background-color 0.2s',
                zIndex: 1
              }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: 'var(--text-secondary)'
                }}>
                  <Upload size={20} />
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)' }}>
                  {videoFile ? videoFile.name : 'Drag and drop or click to upload video (MP4, MOV)'}
                </p>
                {videoFile && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>}
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
              Subtitle / Description
            </label>
            <textarea 
              name="Subtitle"
              value={formData.Subtitle}
              onChange={handleChange}
              placeholder="Briefly describe the video content..." 
              rows={4}
              style={{
                width: '100%',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Time
              </label>
              <input 
                name="Time"
                value={formData.Time}
                onChange={handleChange}
                type="text" 
                placeholder="Training Duration..." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Points
              </label>
              <input 
                name="Points"
                value={formData.Points}
                onChange={handleChange}
                type="number" 
                placeholder="Session Reward Point..." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

        </div>

        <div style={{
          backgroundColor: 'var(--surface-primary)',
          padding: '24px 32px',
          display: 'flex',
          gap: '16px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button onClick={onClose} disabled={isSubmitting} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'var(--text-primary)', border: 'none', color: 'var(--background)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Uploading... Do not close' : 'Upload & Publish'}
          </button>
        </div>

      </div>
    </div>
  );
}
