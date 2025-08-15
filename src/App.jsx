import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import detectLang from 'lang-detector';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState([]);
  const [model, setModel] = useState('gpt-5-nano');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).slice(0, 3); // Limit to 3 files
    
    // Create previews for the selected files
    const newPreviews = newFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    
    setFiles(newFiles);
    setPreviews(newPreviews);
    setError('');
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach(preview => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [previews]);

  const removeFile = (index) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index].url);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one image file');
      return;
    }

    if (!model.trim()) {
      setError('Please specify a model to use');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('model', model);
    if (additionalInstructions.trim()) {
      formData.append('additionalInstructions', additionalInstructions);
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Use the environment variable for the API URL
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await axios.post(
        `${apiUrl}/api/upload`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Unknown error occurred');
      }
      
      setResult(response.data);
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.details || 
                         err.message || 
                         'An error occurred while processing the images';
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Code Turtle</h1>
        <p>slow and steady wins the race</p>
        <p>Upload an image of a coding problem and get it solved by a team of AI agents </p>
      </header>
      
      <div className="configuration-card">
        <h3>Configuration</h3>
        <div className="config-fields">
          <div className="form-group">
            <label htmlFor="model">AI Model</label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g., gpt-5, gpt-5-mini"
              className="form-control"
            >
              <option value="gpt-5">gpt-5 (50 rupees per question)</option>
              <option value="gpt-5-mini">gpt-5-mini (15 rupees per question)</option>
              <option value="gpt-5-nano">gpt-5-nano (5 rupees per question)</option>
              <option value="gpt-5-nano">gemini-2.0-flash (5 rupees per question)</option>
              <option value="gpt-5-mini">gemini-2.5-pro (25 rupees per question)</option>
              <option value="gpt-5-mini">claude-3.5-sonnet (20 rupees per question)</option>
              <option value="gpt-5-mini">claude-3.5-haiku (15 rupees per question)</option>
            </select>
            <div className="hint">Specify the AI model to use for code generation</div>
          </div>
           
          <div className="form-group">
            <label htmlFor="instructions">Additional Instructions</label>
            <textarea
              id="instructions"
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="Any specific instructions or requirements for the solution..."
              className="form-control"
              rows="2"
            />
            <div className="hint">Optional: Add any specific requirements or constraints</div>
          </div>
        </div>
      </div>

      <main>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="file-input">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading || previews.length >= 3}
              multiple
            />
            <label htmlFor="image-upload">
              {previews.length > 0 
                ? `Selected ${previews.length} file${previews.length > 1 ? 's' : ''}` 
                : 'Choose 1-3 images...'}
            </label>
            
            {previews.length > 0 && (
              <div className="file-previews">
                {previews.map((preview, index) => (
                  <div key={index} className="file-preview">
                    <img 
                      src={preview.url} 
                      alt={`Preview ${index + 1}`} 
                      className="preview-image"
                    />
                    <span className="file-name">{preview.name}</span>
                    <button 
                      type="button" 
                      className="remove-file"
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {previews.length > 0 && (
              <p className="hint">
                {3 - previews.length} more image{3 - previews.length !== 1 ? 's' : ''} can be added
              </p>
            )}
          </div>
          
          <button type="submit" disabled={isLoading || files.length === 0}>
            {isLoading ? 'Processing...' : 'Solve Problem'}
          </button>
          
          {error && <p className="error">{error}</p>}
        </form>

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing your problem with AI agents...</p>
          </div>
        )}

        {result && (
          <div className="result">
            {result.problemStatement && (
              <div className="problem-statement">
                <h2>Problem Statement</h2>
                <div className="problem-content">
                  <pre>{result.problemStatement}</pre>
                </div>
              </div>
            )}
            
            <div className="solution-section">
              <h2>Solution</h2>
              <div className="code-block">
                <CodeBlock 
                  code={result.solution.bestSolution} 
                  language={result.language || 'javascript'} 
                />
              </div>
            </div>
            
            {result.testCases && result.testCases.length > 0 && (
              <div className="test-cases">
                <h3>Test Cases</h3>
                <div className="test-cases-grid">
                  {result.testCases.map((testCase, index) => (
                    <div key={index} className="test-case">
                      <h4>Test Case {index + 1}</h4>
                      <p><strong>Input:</strong> {JSON.stringify(testCase.input)}</p>
                      <p><strong>Expected Output:</strong> {JSON.stringify(testCase.expected)}</p>
                      {testCase.description && <p><em>{testCase.description}</em></p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer>
        <p>AI Code Solver - Upload an image of a coding problem to get started</p>
      </footer>
    </div>
  );
}

// Component to handle syntax highlighting with language detection
function CodeBlock({ code, language: defaultLanguage = 'python' }) {
  // Try to detect the language if not provided
  const detectedLanguage = useMemo(() => {
    if (!code) return defaultLanguage;
    try {
      const detected = detectLang(code);
      // Map some common language names to Prism.js supported ones
      const langMap = {
        'javascript': 'javascript',
        'js': 'javascript',
        'python': 'python',
        'py': 'python',
        'java': 'java',
        'c++': 'cpp',
        'cpp': 'cpp',
        'c': 'c',
        'c#': 'csharp',
        'csharp': 'csharp',
        'go': 'go',
        'ruby': 'ruby',
        'rust': 'rust',
        'php': 'php',
        'typescript': 'typescript',
        'ts': 'typescript',
        'swift': 'swift',
        'kotlin': 'kotlin',
        'scala': 'scala',
        'r': 'r',
        'objective-c': 'objectivec',
        'objectivec': 'objectivec',
        'bash': 'bash',
        'shell': 'bash',
        'sql': 'sql',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'yaml': 'yaml',
        'markdown': 'markdown',
        'md': 'markdown',
      };
      
      return langMap[detected.toLowerCase()] || defaultLanguage;
    } catch (e) {
      console.error('Error detecting language:', e);
      return defaultLanguage;
    }
  }, [code, defaultLanguage]);

  return (
    <SyntaxHighlighter 
      language={detectedLanguage}
      style={oneDark}
      showLineNumbers={true}
      wrapLines={true}
      customStyle={{
        margin: 0,
        borderRadius: '6px',
        fontSize: '0.9em',
        lineHeight: '1.5',
      }}
      codeTagProps={{
        style: {
          fontFamily: 'Fira Code, monospace',
        },
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

export default App;
