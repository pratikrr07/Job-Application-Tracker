import { useState } from 'react';
import { deleteJob, updateJob } from '../services/api';

/**
 * JobCard Component
 * 
 * Displays individual job application with edit/delete functionality.
 * Supports inline editing mode with form validation.
 * Status is color-coded for quick visual identification.
 * 
 * @component
 * @param {Object} job - Job application data object
 * @param {Function} onJobUpdated - Callback function triggered after update/delete
 */
export default function JobCard({ job, onJobUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    company: job.company,
    role: job.role,
    status: job.status,
    notes: job.notes
  });
  const [loading, setLoading] = useState(false);

  const statuses = ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];

  const getStatusClass = (status) => {
    const statusClasses = {
      'Applied': 'status-applied',
      'Interview': 'status-interview',
      'Offer': 'status-offer',
      'Rejected': 'status-rejected',
      'Accepted': 'status-accepted'
    };
    return statusClasses[status] || 'status-applied';
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        await deleteJob(job._id, token);
        onJobUpdated();
      } catch (err) {
        alert('Failed to delete job: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await updateJob(job._id, editData, token);
      setIsEditing(false);
      onJobUpdated();
    } catch (err) {
      alert('Failed to update job: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="job-card">
        <input
          type="text"
          value={editData.company}
          onChange={(e) => setEditData({ ...editData, company: e.target.value })}
          className="form-input"
          placeholder="Company"
          style={{ marginBottom: '0.75rem' }}
        />
        <input
          type="text"
          value={editData.role}
          onChange={(e) => setEditData({ ...editData, role: e.target.value })}
          className="form-input"
          placeholder="Role"
          style={{ marginBottom: '0.75rem' }}
        />
        <select
          value={editData.status}
          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
          className="form-select"
          style={{ marginBottom: '0.75rem' }}
        >
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <textarea
          value={editData.notes}
          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
          className="form-textarea"
          placeholder="Notes"
          style={{ marginBottom: '0.75rem' }}
        />
        <div className="job-actions">
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-save"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <div className="job-card-title">{job.role}</div>
          <div className="job-card-company">{job.company}</div>
        </div>
        <span className={`job-status-badge ${getStatusClass(job.status)}`}>
          {job.status}
        </span>
      </div>
      {job.notes && <p className="job-notes">{job.notes}</p>}
      <p className="job-date">
        {new Date(job.created_at).toLocaleDateString()}
      </p>
      <div className="job-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-edit"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="btn btn-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
