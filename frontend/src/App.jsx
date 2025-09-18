import { useState } from "react";
import "./App.css";

// ✅ Logging Middleware
function logEvent(eventType, details) {
  // Hook into pre-test setup logger here
  window.myLogger?.log(eventType, details);

  // fallback demo
  // console.log(`[${eventType}]`, details);
}

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urlMappings, setUrlMappings] = useState({}); // {shortCode: {longUrl, expiry}}

  // Generate random shortcode
  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  // Shorten function
  const shortenUrl = () => {
    if (!longUrl.trim()) {
      logEvent("ERROR", "Empty URL submitted");
      return;
    }

    let shortCode = customCode.trim() || generateShortCode();

    // Ensure uniqueness
    if (urlMappings[shortCode]) {
      logEvent("ERROR", `Shortcode '${shortCode}' already exists`);
      alert("Custom shortcode already in use. Try another.");
      return;
    }

    // Set default validity: 30 mins
    const expiryTime = Date.now() + 30 * 60 * 1000;

    // Save mapping
    const newMapping = {
      longUrl,
      expiry: expiryTime,
    };

    setUrlMappings((prev) => ({
      ...prev,
      [shortCode]: newMapping,
    }));

    const shortened = `http://short.ly/${shortCode}`;
    setShortUrl(shortened);

    logEvent("SHORTEN_URL", {
      longUrl,
      shortCode,
      shortened,
      expiry: new Date(expiryTime).toISOString(),
    });

    // Reset inputs
    setCustomCode("");
    setLongUrl("");
  };

  return (
    <div className="App">
      <h1>URL Shortener</h1>
      <div className="shortener-container">
        <input
          type="url"
          placeholder="Enter the long URL to shorten"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="url-input"
        />

        <input
          type="text"
          placeholder="Optional: Custom shortcode"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          className="url-input"
        />

        <button onClick={shortenUrl} className="shorten-btn">
          Shorten URL
        </button>

        {shortUrl && (
          <div className="result">
            <p>Shortened URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="short-url"
            >
              {shortUrl}
            </a>
          </div>
        )}
      </div>

      {/* Debug view of mappings (you can remove later) */}
      <div className="mappings">
        <h3>All URL Mappings (Debug)</h3>
        <ul>
          {Object.entries(urlMappings).map(([code, data]) => (
            <li key={code}>
              <b>{code}</b> → {data.longUrl} (expires{" "}
              {new Date(data.expiry).toLocaleTimeString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
