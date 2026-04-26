const BASE_URL = "http://localhost:8080/api/v1/short-codes";

export const shortenUrl = async (longUrl) => {
  const response = await fetch(BASE_URL, {
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
  const response = await fetch(`${BASE_URL}/{shortCode}`, {
    redirect: "manual",
  });

  const longUrl = response.headers.get("Location");

  if (!longUrl) {
    throw new Error("Could not find original URL");
  }
};
