import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { marked } from 'marked';

const InsightsPage = () => {
  const location = useLocation();
  const { title, labels, values, excelFile } = location.state || {};

  const defaultPrompt = `The data includes metrics such as digital ad spends (by channel and campaign), impressions, clicks, conversions, cost per acquisition (CPA), return on ad spend (ROAS), engagement rates, and campaign-level performance across platforms (Google, Meta, LinkedIn, etc.).

Your task is to:
1. Identify and summarize the key performance observations from the data. Highlight trends, anomalies, high or low-performing campaigns/channels, and changes over time.
2. Suggest 3–5 key actionable insights or recommendations that the marketing or business team can implement to improve performance, optimize budget allocation, or boost ROI.
3. Indicate if any further analysis or data (e.g., customer segments, offline conversions, creative analysis) is required for deeper insights.

Present the response under two headings:
- **Key Observations**
- **Recommended Actions for Marketing Team**

Add a bold title to each insight or recommendation.
Ensure your response is specific, data-driven, and aligned to business impact.`;

  const [prompt, setPrompt] = useState(defaultPrompt);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState('');

  const formatInsightText = (text) => {

    // let formatted = text.replace(/(?<!^)/g, '<br/><br/>');

    let formatted = text.replace(/(\n\s*){2,}/g, '\n\n');

    formatted = formatted.replace(/^(\d+)\.\s*/gm, '<br/><strong>$1.</strong> ');

    return formatted;
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, excelFile }),
      });

      const data = await res.json();
      const formattedInsight = formatInsightText(data.insight || 'Failed to fetch insights.');
      setInsight(formattedInsight);

    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsight('Error fetching insights.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">{title} - AI Insights</h2>

      <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
      <textarea
        rows="12"
        className="w-full border border-gray-300 rounded-lg p-4 mb-6 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
        // value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`transition duration-200 ease-in-out bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        {loading ? 'Generating...' : 'Generate Insight'}
      </button>

      {insight && (
        <div
          className="mt-10 bg-gray-50 border border-gray-200 p-8 rounded-lg text-[15px] leading-relaxed font-sans prose prose-blue max-w-none"
          dangerouslySetInnerHTML={{ __html: marked(insight) }}
        />
      )}

    </div>
  );
};

export default InsightsPage;
