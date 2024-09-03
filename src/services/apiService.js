const BASE_URL = 'http://94.74.86.174:8080/api';

const request = async (url, method, body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  return response.json();
};

export const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during login:', error);
    return { error: error.message };
  }
};

export const register = (email, username, password) => {
  return request(`${BASE_URL}/register`, 'POST', { email, username, password });
};

export const getAllChecklists = (token) => {
  return request(`${BASE_URL}/checklist`, 'GET', null, token);
};

export const createChecklist = (name, token) => {
  return request(`${BASE_URL}/checklist`, 'POST', { name }, token);
};

export const deleteChecklist = (checklistId, token) => {
  return request(`${BASE_URL}/checklist/${checklistId}`, 'DELETE', null, token);
};

export const getChecklistItems = (checklistId, token) => {
  return request(`${BASE_URL}/checklist/${checklistId}/item`, 'GET', null, token);
};

export const createChecklistItem = (checklistId, itemName, token) => {
  return fetch(`${BASE_URL}/checklist/${checklistId}/item`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ itemName })
  })
  .then(response => response.json())
  .catch(error => console.error('Error adding checklist item:', error));

};

export const updateChecklistItemStatus = (checklistId, checklistItemId, newStatus, token) => {
  return request(`${BASE_URL}/checklist/${checklistId}/item/${checklistItemId}`, 'PUT', JSON.stringify({ completed: newStatus }), token);
};


export const deleteChecklistItem = (checklistId, checklistItemId, token) => {
  return request(`${BASE_URL}/checklist/${checklistId}/item/${checklistItemId}`, 'DELETE', null, token);
};

export const renameChecklistItem = (checklistId, checklistItemId, itemName, token) => {
  return request(`${BASE_URL}/checklist/${checklistId}/item/rename/${checklistItemId}`, 'PUT', { itemName }, token);
};
