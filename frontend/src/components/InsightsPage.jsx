import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { marked } from 'marked'; 

const InsightsPage = () => {
  const location = useLocation();
  const { title, labels, values, excelFile } = location.state || {};

  const defaultPrompt = `The data includes metrics such as digital ad spends (by channel and campaign), impressions, clicks, conversions, cost per acquisition (CPA), return on ad spend (ROAS), engagement rates, and campaign-level performance across platforms (Google, Meta, LinkedIn, etc.).
Your task is to:
Identify and summarize the key performance observations from the data. Highlight trends, anomalies, high or low-performing campaigns/channels, and changes over time.
Suggest 3–5 key actionable insights or recommendations that the marketing or business team can implement to improve performance, optimize budget allocation, or boost ROI.
Indicate if any further analysis or data (e.g., customer segments, offline conversions, creative analysis) is required for deeper insights.
Present the response under two headings:
Key Observations
Recommended Actions for Marketing Team
Add a bold title to each insight or recommendation.
Ensure your response is specific, data-driven, and aligned to business impact.
`;

  const [prompt, setPrompt] = useState(defaultPrompt);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, excelFile }),
      });

      const data = await res.json();
      setInsight(data.insight || 'Failed to fetch insights.');
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsight('Error fetching insights.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">{title} - Insights</h2>
      <textarea
        rows="15"
        className="w-full border rounded p-2 mb-4 font-mono"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Generating...' : 'Generate Insight'}
      </button>
      {insight && (
        <div
          className="mt-6 bg-gray-100 p-4 rounded text-sm font-sans prose"
          dangerouslySetInnerHTML={{ __html: marked(insight) }}
        />
      )}
    </div>
  );
};

export default InsightsPage;
