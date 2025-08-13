import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState([]);

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

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

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
        <h1>AI Code Solver</h1>
        <p>Upload an image of a coding problem and get the solution</p>
      </header>

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
                <pre>{result.solution.bestSolution}</pre>
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

export default App;
