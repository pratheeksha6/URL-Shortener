const BASE_URL = "http://127.0.0.1:8000/api";

export const shortenUrl = async (longUrl) => {
  const response = await fetch(`${BASE_URL}/v1/short-codes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ longUrl }),
  });

  if (!response.ok) {
    throw new Error("Failed to shorten URL");
  }

  return response.json();
};

export const getLongUrl = async (shortCode) => {
  const response = await fetch(`${BASE_URL}/v1/short-codes/${shortCode}`, {
    redirect: "manual",
  });

  const longUrl = response.headers.get("Location");

  if (!longUrl) {
    throw new Error("Could not find original URL");
  }
};

export const deleteUrl = async (shortCode) => {
  const response = await fetch(
    `${BASE_URL}/v1/short-codes/${shortCode}/delete`,
    {
      method: "Delete",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete URL");
  }

  return response.json();
};
