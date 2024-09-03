import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChecklistItems, updateChecklistItemStatus, createChecklistItem, deleteChecklistItem, renameChecklistItem } from '../services/apiService';

const ChecklistView = () => {
  const { checklistId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [editItem, setEditItem] = useState({ id: null, name: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, [checklistId]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await getChecklistItems(checklistId, token);
      if (response.data) {
        setItems(response.data);
      } else {
        setErrorMessage('Failed to fetch checklist items');
      }
    } catch (error) {
      console.error('Error fetching checklist items:', error);
      setErrorMessage('An error occurred while fetching checklist items');
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await createChecklistItem(checklistId, newItemName, token);
      if (response.data) {
        setItems([...items, response.data]);
        setNewItemName('');
      } else {
        setErrorMessage('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setErrorMessage('An error occurred while adding an item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        await deleteChecklistItem(checklistId, itemId, token);
        setItems(items.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error deleting item:', error);
        setErrorMessage('An error occurred while deleting the item');
      }
    }
  };

  const handleRenameItem = async (itemId) => {
    if (!editItem.name.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await renameChecklistItem(checklistId, itemId, editItem.name, token);
      const updatedItems = items.map(item => item.id === itemId ? { ...item, name: editItem.name } : item);
      setItems(updatedItems);
      setEditItem({ id: null, name: '' });
    } catch (error) {
      console.error('Error renaming item:', error);
      setErrorMessage('An error occurred while renaming the item');
    }
  };

  const handleEditItem = (item) => {
    setEditItem({ id: item.id, name: item.name });
  };

  const handleUpdateItemStatus = async (itemId, completed) => {
    try {
      const token = localStorage.getItem('token');
      await updateChecklistItemStatus(checklistId, itemId, completed, token);
      const updatedItems = items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error updating item status:', error);
      setErrorMessage('An error occurred while updating item status');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Items in Checklist with id: {checklistId}</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter new item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddItem}>Add Item</button>
      </div>

      <ul className="list-group">
        {items.map((item, index) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span className="mr-3">{index + 1}.</span> {/* Item number starting from 1 */}
            {editItem.id === item.id ? (
              <input
                value={editItem.name}
                className="form-control"
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                onBlur={() => handleRenameItem(item.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleRenameItem(item.id)}
                autoFocus
              />
            ) : (
              <>
                <span style={{
                  textDecoration: item.completed ? 'line-through' : 'none',
                  color: item.completed ? '#aaa' : 'inherit'
                }}>
                  {item.name}
                </span>
                <div className='d-flex gap-3'>
                  <button className="btn btn-info" onClick={() => handleEditItem(item)}>Edit Name</button>
                  <button className={`btn ${item.completed ? 'btn-secondary' : 'btn-primary'}`} onClick={() => handleUpdateItemStatus(item.id, !item.completed)}>
                    {item.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <button className="btn btn-secondary mt-4" onClick={() => navigate('/checklist')}>Back to Checklists</button>
    </div>
  );
};

export default ChecklistView;
