import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const TvAndDigitalSpends = () => {
    const [tvSpendsData, setTvSpendsData] = useState(null);
    const [digitalSpendsData, setDigitalSpendsData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data/spends-data`);
                const jsonData = await response.json();

                console.log(jsonData);

                const labels = jsonData.map(item => item.Month);

                const parseValue = (value) => {
                    if (typeof value === 'string') {
                        const number = parseFloat(value);
                        if (value.includes('B')) {
                            return number * 1e9;
                        } else if (value.includes('M')) {
                            return number * 1e6;
                        } else {
                            return number; 
                        }
                    }
                    return value;
                };

                const tvSpends = jsonData.map(item => parseValue(item['TV Spend (in Billion)']));
                const metaSpends = jsonData.map(item => parseValue(item['Meta Spend (in Million)']));
                const dv360Spends = jsonData.map(item => parseValue(item['DV 360 Spend (in Million)']));

                setTvSpendsData({
                    labels,
                    datasets: [
                        {
                            label: 'TV Spends',
                            data: tvSpends,
                            borderColor: '#4ade80',
                            backgroundColor: 'rgba(74, 174, 128, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointRadius: 3,
                            pointBackgroundColor: '#4ade80',
                            snapgaps: true,
                        }
                    ]
                });

                setDigitalSpendsData({
                    labels,
                    datasets: [
                        {
                            label: 'Meta',
                            data: metaSpends,
                            borderColor: '#60a5fa',
                            backgroundColor: '#60a5fa',
                            tension: 0.4,
                            yAxisID: 'y',
                            pointRadius: 3,
                            pointBackgroundColor: '#60a5fa',
                            snapgaps: true,
                        },
                        {
                            label: 'DV 360',
                            data: dv360Spends,
                            borderColor: '#facc15',
                            backgroundColor: '#facc15',
                            tension: 0.4,
                            yAxisID: 'y1',
                            pointRadius: 3,
                            pointBackgroundColor: '#facc15',
                            snapgaps: true,
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
    };

    const tvSpendsOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'TV Spends (in INR) as per Month & Brand',
                font: {
                    size: 18,
                }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 4000000000, 
                ticks: {
                    stepSize: 1000000000, 
                    callback: (value) => (value / 1e9).toFixed(1) + 'B',
                },
                grid: {
                    drawTicks: true,
                },
            }
        }
    };

    const digitalSpendsOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Digital Spends (in INR) as per Month & Brand',
                font: {
                    size: 18,
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                min: 0,
                max: 200000000, 
                ticks: {
                    stepSize: 50000000,
                    callback: (value) => (value / 1e6).toFixed(0) + 'M',
                },
                grid: {
                    drawTicks: true,
                },
            },
            y1: {
                type: 'linear',
                position: 'right',
                min: 0,
                max: 300000000, 
                ticks: {
                    stepSize: 100000000,
                    callback: (value) => (value / 1e6).toFixed(0) + 'M',
                },
                grid: {
                    drawOnChartArea: false,
                },
            }
        }
    };

    return (
        <div className="p-1 bg-gray-100 min-h-[60vh]">
  <div className="flex flex-col md:flex-row gap-5">

     {/* TV Spends  */}
    <div className="w-full md:w-3/4 bg-white p-6 rounded-2xl shadow-xl h-[400px]">
      {tvSpendsData ? (
        <Line data={tvSpendsData} options={tvSpendsOptions} />
      ) : (
        <div className="text-gray-500 text-center">Loading TV Spends Chart...</div>
      )}
    </div>

     {/* Digital Spends  */}
    <div className="w-full md:w-3/4 bg-white p-6 rounded-2xl shadow-xl h-[400px]">
      {digitalSpendsData ? (
        <Line data={digitalSpendsData} options={digitalSpendsOptions} />
      ) : (
        <div className="text-gray-500 text-center">Loading Digital Spends Chart...</div>
      )}
    </div>
  </div>
</div>
    )
};

export default TvAndDigitalSpends;
