// Charts.jsx
import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

const Charts = () => {
    const [chartData, setChartData] = useState([]);

    // Fetch your chart data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:1000/charts'); 
                const data = response.data;

                // Ensure transformedData corresponds to your expected structure
                const transformedData = categories.map((category) => {
                    // Find the value for the current category
                    const item = data.find(item => item.category === category);
                    return item ? item.value : 0; // Use 0 if no data found
                });

                setChartData(transformedData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchData();
    }, []);

    // Define your categories (price ranges)
    const categories = ['0-100', '100-200', '200-300', '300-400', '400-500', '500-600', '600-700', '700-800', '800-900', '900-1000'];

    // Highcharts options
    const chartOptions = {
        chart: {
            type: 'column', // Change to 'bar' if you want a bar chart
            width: 700, // Adjust the width of the chart
            backgroundColor: '#2c2c2c' // Dark background color
        },
        title: {
            text: 'Your Chart Title', // Customize the title as needed
            style: {
                color: '#ffffff' // Title text color
            }
        },
        xAxis: {
            categories: categories, // Set the defined categories for x-axis
            title: {
                text: 'Price Ranges', // Customize the x-axis title as needed
                style: {
                    color: '#ffffff' // X-axis title color
                }
            },
            tickmarkPlacement: 'on', // Adjusts the placement of ticks
            labels: {
                autoRotation: false, // Prevent automatic rotation of labels
                style: {
                    color: '#ffffff' // Label color
                }
            }
        },
        yAxis: {
            title: {
                text: 'Number of Items',
                style: {
                    color: '#ffffff' // Y-axis title color
                }
            },
            min: 2, // Start the y-axis at 0
            tickInterval: -10, // Set the interval for y-axis ticks
            labels: {
                formatter: function() {
                    return this.value; // Show the value as is
                },
                style: {
                    color: '#ffffff' // Y-axis label color
                }
            }
        },
        series: [
            {
                name: '',
                data: chartData,
                colorByPoint: true,
                // Change colors of the columns
                // colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
            }
        ],
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    style: {
                        color: '#ffffff' // Data label color
                    }
                }
            }
        },
        legend: {
            itemStyle: {
                color: '#ffffff' // Legend item color
            }
        },
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};

export default Charts;
