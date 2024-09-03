import React, { useEffect, useState } from 'react';
import { getAllChecklists, createChecklist, deleteChecklist } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const Checklist = () => {
  const [checklists, setChecklists] = useState([]);
  const [newChecklistName, setNewChecklistName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getAllChecklists(token);
        if (response.data) {
          setChecklists(response.data);
        } else {
          setErrorMessage('Failed to fetch checklists');
        }
      } catch (error) {
        console.error('Error fetching checklists:', error);
        setErrorMessage('An error occurred while fetching checklists');
      }
    };

    fetchChecklists();
  }, []);

  const handleAddChecklist = async () => {
    if (!newChecklistName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await createChecklist(newChecklistName, token);
      if (response.data) {
        setChecklists([...checklists, response.data]);
        setNewChecklistName('');
      } else {
        setErrorMessage('Failed to create checklist');
      }
    } catch (error) {
      console.error('Error creating checklist:', error);
      setErrorMessage('An error occurred while creating a checklist');
    }
  };

  const handleDeleteChecklist = async (checklistId) => {
    try {
      const token = localStorage.getItem('token');
      await deleteChecklist(checklistId, token);
      setChecklists(checklists.filter((checklist) => checklist.id !== checklistId));
    } catch (error) {
      console.error('Error deleting checklist:', error);
      setErrorMessage('An error occurred while deleting the checklist');
    }
  };

  const viewItems = (checklistId) => {
    navigate(`/checklist/${checklistId}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checklist</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="New checklist name"
          value={newChecklistName}
          onChange={(e) => setNewChecklistName(e.target.value)}
        />
        <button className="btn btn-success mt-2" onClick={handleAddChecklist}>Add Checklist</button>
      </div>
      <ul className="list-group">
        {checklists.map((checklist) => (
          <li key={checklist.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{checklist.name}</span>
            <div className='d-flex gap-3'>
              <button className="btn btn-info" onClick={() => viewItems(checklist.id)}>View Items</button>
              <button className="btn btn-danger" onClick={() => handleDeleteChecklist(checklist.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checklist;
