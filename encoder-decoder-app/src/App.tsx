import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiCopy } from 'react-icons/fi';
import { allTools, EncodeTool, detectEncodings, DetectionResult } from './tools/encoders';
import './App.css';

interface HistoryItem {
  id: string;
  toolId: string;
  type: 'encode' | 'decode';
  input: string;
  output: string;
  timestamp: number;
  duration?: number; // milliseconds
}

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [selectedTool, setSelectedTool] = useState<EncodeTool | null>(allTools[0]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [processingTime, setProcessingTime] = useState(0);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (input.length > 10 && activeTab === 'decode') {
      const detected = detectEncodings(input);
      setDetections(detected);
    } else {
      setDetections([]);
    }
  }, [input, activeTab]);

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool || !input) return;

    const startTime = performance.now();
    
    let result = '';
    if (activeTab === 'encode') {
      result = selectedTool.encode(input);
    } else {
      result = selectedTool.decode(input);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    setProcessingTime(duration);
    setOutput(result);

    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      toolId: selectedTool.id,
      type: activeTab,
      input,
      output: result,
      timestamp: Date.now(),
      duration: duration
    };

    setHistory([newHistoryItem, ...history.slice(0, 49)]);;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const applySuggestion = (toolId: string) => {
    const tool = allTools.find(t => t.id === toolId);
    if (tool) {
      setSelectedTool(tool);
      setActiveTab('decode');
      setDetections([]);
      // Auto-decode
      const result = tool.decode(input);
      setOutput(result);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    const tool = allTools.find(t => t.id === item.toolId);
    if (tool) {
      setSelectedTool(tool);
      setInput(item.input);
      setOutput(item.output);
      setActiveTab(item.type);
      setShowHistory(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  const categoryGroups = Array.from(
    allTools.reduce((acc, tool) => {
      const category = tool.category;
      if (!acc.has(category)) {
        acc.set(category, []);
      }
      const tools = acc.get(category);
      if (tools) {
        tools.push(tool);
      }
      return acc;
    }, new Map<string, EncodeTool[]>())
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🔐 Encoder/Decoder Toolkit</h1>
          <button
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle theme"
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </header>

      <div className="container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Tools</h2>
            <button
              className="history-btn"
              onClick={() => setShowHistory(!showHistory)}
              title="Show history"
            >
              📜 {history.length}
            </button>
          </div>

          {showHistory ? (
            <div className="history-panel">
              <div className="history-header">
                <h3>History</h3>
                <button className="clear-history" onClick={clearHistory}>Clear</button>
              </div>
              <div className="history-list">
                {history.length === 0 ? (
                  <p className="empty-history">No history yet</p>
                ) : (
                  history.map(item => (
                    <div
                      key={item.id}
                      className="history-item"
                      onClick={() => loadFromHistory(item)}
                    >
                      <div className="history-tool">
                        {allTools.find(t => t.id === item.toolId)?.name}
                      </div>
                      <div className="history-type">{item.type}</div>
                      <div className="history-preview">
                        {item.input.substring(0, 30)}
                        {item.input.length > 30 ? '...' : ''}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="tools-list">
              {categoryGroups.map(([category, tools]) => (
                <div key={category} className="tool-category">
                  <h3 className="category-title">{category}</h3>
                  {(tools as EncodeTool[]).map(tool => (
                    <button
                      key={tool.id}
                      className={`tool-btn ${selectedTool?.id === tool.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTool(tool);
                        setInput('');
                        setOutput('');
                      }}
                      title={tool.description}
                    >
                      <div className="tool-name">{tool.name}</div>
                      <div className="tool-desc">{tool.description}</div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </aside>

        <main className="main-content">
          {selectedTool ? (
            <>
              <div className="tool-header">
                <div>
                  <h2>{selectedTool.name}</h2>
                  <p>{selectedTool.description}</p>
                </div>
              </div>

              <form onSubmit={handleProcess} className="processor-form">
                <div className="tabs">
                  <button
                    type="button"
                    className={`tab ${activeTab === 'encode' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('encode');
                      setOutput('');
                    }}
                  >
                    Encode
                  </button>
                  <button
                    type="button"
                    className={`tab ${activeTab === 'decode' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('decode');
                      setOutput('');
                    }}
                  >
                    Decode
                  </button>
                </div>

                <div className="io-container">
                  <div className="io-section">
                    <label>Input</label>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter text here..."
                      className="textarea"
                    />
                    {detections.length > 0 && (
                      <div className="detection-panel">
                        <h4>💡 Detected Encoding Types:</h4>
                        <div className="detection-list">
                          {detections.map((detection) => (
                            <button
                              key={detection.toolId}
                              type="button"
                              className="detection-item"
                              onClick={() => applySuggestion(detection.toolId)}
                              title={detection.reason}
                            >
                              <div className="detection-name">{detection.toolName}</div>
                              <div className="detection-confidence">
                                {Math.round(detection.confidence)}% confidence
                              </div>
                              <div className="detection-reason">{detection.reason}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="process-btn">
                    {activeTab === 'encode' ? 'Encode' : 'Decode'}
                  </button>

                  {processingTime > 0 && (
                    <div className="performance-stats">
                      <div className="stat-item">
                        <span>⏱️ Time:</span>
                        <strong>{processingTime.toFixed(2)}ms</strong>
                      </div>
                      <div className="stat-item">
                        <span>📊 Input:</span>
                        <strong>{input.length} chars</strong>
                      </div>
                      {output && (
                        <div className="stat-item">
                          <span>📤 Output:</span>
                          <strong>{output.length} chars</strong>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="io-section">
                    <label>Output</label>
                    <textarea
                      value={output}
                      readOnly
                      placeholder="Result will appear here..."
                      className="textarea"
                    />
                    {output && (
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={copyToClipboard}
                        title="Copy to clipboard"
                      >
                        <FiCopy size={18} /> Copy
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="no-tool">
              <h2>Select a tool to get started</h2>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
