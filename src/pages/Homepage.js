import { useState } from "react";
import { shortenUrl } from "../services/urlService";

function Homepage() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setShortUrl(result.shortUrl);
    } catch (error) {
      setError("Failed to shorten URL. Please try again");
    } finally {
      setLoading(false);
    }
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
          <div>
            <p className="result-label">Shortened URL : </p>
            <a
              className="result-url"
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
            >
              {shortUrl}
            </a>
          </div>
          <span
            className="copy-icon"
            onClick={handleCopy}
            title="Copy"
            style={{ cursor: "pointer", fontSize: "20px", marginLeft: "8px" }}
          >
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
      )}
    </div>
  );
}

export default Homepage;
