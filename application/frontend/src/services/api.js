const API_BASE_URL = window.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const fetchHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    return { status: 'DOWN', error: err.message };
  }
};

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/api/tasks`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return await response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!response.ok) throw new Error('Failed to create task');
  return await response.json();
};

export const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!response.ok) throw new Error('Failed to update task');
  return await response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete task');
  return await response.json();
};
