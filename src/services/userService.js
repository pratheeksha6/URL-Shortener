const BASE_URL = "http://127.0.0.1:8000/api";

export const getAllUsers = async () => {
  const response = await fetch(`${BASE_URL}/v1/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/v1/users/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create user");
  }

  return data;
};

export const updateUser = async (userId, userData) => {
  const response = await fetch(`${BASE_URL}/v1/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update user");
  }

  return data;
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${BASE_URL}/v1/users/${userId}/delete`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete user");
  return response.json();
};
