import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import './DTCQueryInterface.css';

const DTCQueryInterface = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const result = await axiosInstance.post('/dtc-initialize', { query });
            setResponse(result.data.response);
        } catch (err) {
            setError('Failed to get response. Please try again.');
            console.error('Query error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dtc-query-container">
            <h2>BMW DTC Code Query</h2>
            <form onSubmit={handleSubmit} className="query-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your DTC code or question..."
                    className="query-input"
                />
                <button 
                    type="submit" 
                    disabled={loading || !query.trim()}
                    className="submit-button"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}
            
            {response && (
                <div className="response-container">
                    <h3>Response:</h3>
                    <div className="response-content">
                        {response}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DTCQueryInterface; 