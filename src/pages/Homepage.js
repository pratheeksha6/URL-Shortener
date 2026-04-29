import { useState } from "react";
import { shortenUrl } from "../services/urlService";

function Homepage() {
  const [longUrl, setLongUrl] = useState("");
  const [submittedLongUrl, setSubmittedLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("urlHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const validateUrl = (url) => {
    if (!url) {
      return "Please enter a URL";
    }
    try {
      const parsed = new URL(url);
      console.log(parsed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return "URL must start with http:// or https://";
      }
    } catch (e) {
      return "Please enter a valid URL";
    }
    return null;
  };

  const handleShorten = async () => {
    const validateError = validateUrl(longUrl);
    if (validateError) {
      setError(validateError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await shortenUrl(longUrl);
      const shortCode = result.shortUrl.split("/").pop();
      const correctShortUrl = `http://localhost:8080/api/v1/short-codes/${shortCode}`;
      setShortUrl(correctShortUrl);
      setSubmittedLongUrl(longUrl);
      setLongUrl("");

      const newItem = {
        longUrl: longUrl,
        shortUrl: correctShortUrl,
      };

      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("urlHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      setError("Failed to shorten URL. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem("urlHistory", JSON.stringify(updatedHistory));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="card">
      <h1 className="title">URL Shortener</h1>
      <div className="input-row">
        <input
          className="url-input"
          type="text"
          placeholder="Paste your long URL here"
          value={longUrl}
          onChange={(e) => {
            setLongUrl(e.target.value);
            setError("");
            setShortUrl("");
          }}
        />
        <button
          className="shorten-btn"
          onClick={handleShorten}
          disabled={loading}
        >
          Shorten
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {loading && <p className="loading-msg">⏳ Shortening your URL...</p>}

      {shortUrl && (
        <div className="result-box">
          <div style={{ width: "100%" }}>
            <p className="result-label">Long URL</p>
            <p className="result-long-url">{submittedLongUrl}</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "8px",
              }}
            >
              <div>
                <p className="result-label">Short URL</p>
                <a
                  className="result-url"
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {shortUrl}
                </a>
              </div>
              <span className="copy-icon" onClick={handleCopy} title="Copy">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <div className="history-header">
            <h2 className="history-title">History</h2>
            <button
              className="clear-btn"
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("urlHistory");
              }}
            >
              Clear All
            </button>
          </div>
          {history
            .filter((item, index) => index !== 0 || !shortUrl)
            .map((item, index) => (
              <div className="history-item" key={index}>
                <div className="history-urls">
                  <p className="history-long-url">{item.longUrl}</p>
                  <a
                    className="history-short-url"
                    href={item.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    {item.shortUrl}
                  </a>
                </div>
                <span
                  className="copy-icon"
                  title="copy"
                  onClick={() => navigator.clipboard.writeText(item.shortUrl)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </span>
                <span
                  className="delete-icon"
                  title="Delete"
                  onClick={() => handleDeleteHistory(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M9 6V4h6v2"></path>
                  </svg>
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Homepage;
