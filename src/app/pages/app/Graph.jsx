'use client';

import { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveCalendar } from '@nivo/calendar';
import { FiRefreshCw, FiPieChart, FiBarChart2, FiCalendar, FiTrendingUp } from 'react-icons/fi';

const WorkGraphView = () => {
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    const fetchWorks = async () => {
        try {
            setLoading(true);
            setError('');

            // Extract projectId from URL
            const pathSegments = window.location.pathname.split("/");
            const projectId = pathSegments[pathSegments.length - 1];

            if (!projectId) throw new Error("Project ID not found in URL");

            // Get token from localStorage
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token not found in localStorage");

            // API call using fetch
            const response = await fetch(
                `http://localhost:5000/api/v1/work/${projectId}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setWorks(data.works || []);
        } catch (err) {
            setError(err.message || "Failed to fetch works");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    // Process data for charts
    const processStatusData = () => {
        const statusCount = works.reduce((acc, work) => {
            acc[work.status] = (acc[work.status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(statusCount).map(([status, count]) => ({
            id: status,
            label: status,
            value: count,
        }));
    };

    const processPriorityData = () => {
        const priorityCount = works.reduce((acc, work) => {
            acc[work.priority] = (acc[work.priority] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(priorityCount).map(([priority, count]) => ({
            priority,
            count,
        }));
    };

    const processWorkTypeData = () => {
        const workTypeCount = works.reduce((acc, work) => {
            acc[work.workType] = (acc[work.workType] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(workTypeCount).map(([workType, count]) => ({
            workType,
            count,
        }));
    };

    const processTimelineData = () => {
        // Group by date and status
        const dateStatusMap = {};

        works.forEach(work => {
            const date = new Date(work.startDate).toISOString().split('T')[0];
            if (!dateStatusMap[date]) {
                dateStatusMap[date] = {
                    date,
                    TODO: 0,
                    'In Progress': 0,
                    Completed: 0,
                    'On Hold': 0,
                    Removed: 0,
                };
            }
            dateStatusMap[date][work.status] += 1;
        });

        // Convert to array and sort by date
        return Object.values(dateStatusMap).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const processCalendarData = () => {
        return works.map(work => {
            const day = new Date(work.startDate).toISOString().split('T')[0];
            return {
                value: 1,
                day,
            };
        });
    };

    const statusData = processStatusData();
    const priorityData = processPriorityData();
    const workTypeData = processWorkTypeData();
    const timelineData = processTimelineData();
    const calendarData = processCalendarData();

    // Create line chart data
    const lineChartData = [
        {
            id: 'Tasks',
            color: 'hsl(210, 70%, 50%)',
            data: timelineData.map((item, index) => ({
                x: item.date,
                y: Object.values(item).reduce((sum, val) => typeof val === 'number' ? sum + val : sum, 0),
            })),
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-red-600 bg-red-100 p-4 rounded-lg">
                    Error: {error}
                    <button
                        onClick={fetchWorks}
                        className="ml-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-full mx-auto">

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-2 px-4 font-medium flex items-center ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <FiPieChart className="mr-2" />
                        Overview
                    </button>
                    <button
                        className={`py-2 px-4 font-medium flex items-center ${activeTab === 'timeline' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('timeline')}
                    >
                        <FiTrendingUp className="mr-2" />
                        Timeline
                    </button>
                    <button
                        className={`py-2 px-4 font-medium flex items-center ${activeTab === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('calendar')}
                    >
                        <FiCalendar className="mr-2" />
                        Calendar
                    </button>
                </div>

                {works.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg">No works found for this project.</p>
                        <button
                            onClick={fetchWorks}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Refresh Data
                        </button>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Status Pie Chart */}
                                <div className="bg-white p-6 rounded-xl shadow-md h-96">
                                    <h2 className="text-lg font-semibold mb-4">Work Status Distribution</h2>
                                    <ResponsivePie
                                        data={statusData}
                                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                        innerRadius={0.5}
                                        padAngle={0.7}
                                        cornerRadius={3}
                                        activeOuterRadiusOffset={8}
                                        colors={{ scheme: 'nivo' }}
                                        borderWidth={1}
                                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                                        arcLinkLabelsSkipAngle={10}
                                        arcLinkLabelsTextColor="#333333"
                                        arcLinkLabelsThickness={2}
                                        arcLinkLabelsColor={{ from: 'color' }}
                                        arcLabelsSkipAngle={10}
                                        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                                        legends={[
                                            {
                                                anchor: 'bottom',
                                                direction: 'row',
                                                justify: false,
                                                translateX: 0,
                                                translateY: 56,
                                                itemsSpacing: 0,
                                                itemWidth: 100,
                                                itemHeight: 18,
                                                itemTextColor: '#999',
                                                itemDirection: 'left-to-right',
                                                itemOpacity: 1,
                                                symbolSize: 18,
                                                symbolShape: 'circle',
                                                effects: [
                                                    {
                                                        on: 'hover',
                                                        style: {
                                                            itemTextColor: '#000'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]}
                                    />
                                </div>

                                {/* Priority Bar Chart */}
                                <div className="bg-white p-6 rounded-xl shadow-md h-96">
                                    <h2 className="text-lg font-semibold mb-4">Work Priority Distribution</h2>
                                    <ResponsiveBar
                                        data={priorityData}
                                        keys={['count']}
                                        indexBy="priority"
                                        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                                        padding={0.3}
                                        valueScale={{ type: 'linear' }}
                                        indexScale={{ type: 'band', round: true }}
                                        colors={{ scheme: 'nivo' }}
                                        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                        axisTop={null}
                                        axisRight={null}
                                        axisBottom={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legend: 'Priority',
                                            legendPosition: 'middle',
                                            legendOffset: 32
                                        }}
                                        axisLeft={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legend: 'Count',
                                            legendPosition: 'middle',
                                            legendOffset: -40
                                        }}
                                        labelSkipWidth={12}
                                        labelSkipHeight={12}
                                        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                        legends={[
                                            {
                                                dataFrom: 'keys',
                                                anchor: 'bottom-right',
                                                direction: 'column',
                                                justify: false,
                                                translateX: 120,
                                                translateY: 0,
                                                itemsSpacing: 2,
                                                itemWidth: 100,
                                                itemHeight: 20,
                                                itemDirection: 'left-to-right',
                                                itemOpacity: 0.85,
                                                symbolSize: 20,
                                                effects: [
                                                    {
                                                        on: 'hover',
                                                        style: {
                                                            itemOpacity: 1
                                                        }
                                                    }
                                                ]
                                            }
                                        ]}
                                        animate={true}
                                        motionStiffness={90}
                                        motionDamping={15}
                                    />
                                </div>

                                {/* Work Type Bar Chart */}
                                <div className="bg-white p-6 rounded-xl shadow-md h-96">
                                    <h2 className="text-lg font-semibold mb-4">Work Type Distribution</h2>
                                    <ResponsiveBar
                                        data={workTypeData}
                                        keys={['count']}
                                        indexBy="workType"
                                        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                                        padding={0.3}
                                        valueScale={{ type: 'linear' }}
                                        indexScale={{ type: 'band', round: true }}
                                        colors={{ scheme: 'pastel1' }}
                                        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                        axisTop={null}
                                        axisRight={null}
                                        axisBottom={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: -45,
                                            legend: 'Work Type',
                                            legendPosition: 'middle',
                                            legendOffset: 40
                                        }}
                                        axisLeft={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legend: 'Count',
                                            legendPosition: 'middle',
                                            legendOffset: -40
                                        }}
                                        labelSkipWidth={12}
                                        labelSkipHeight={12}
                                        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                        legends={[
                                            {
                                                dataFrom: 'keys',
                                                anchor: 'bottom-right',
                                                direction: 'column',
                                                justify: false,
                                                translateX: 120,
                                                translateY: 0,
                                                itemsSpacing: 2,
                                                itemWidth: 100,
                                                itemHeight: 20,
                                                itemDirection: 'left-to-right',
                                                itemOpacity: 0.85,
                                                symbolSize: 20,
                                                effects: [
                                                    {
                                                        on: 'hover',
                                                        style: {
                                                            itemOpacity: 1
                                                        }
                                                    }
                                                ]
                                            }
                                        ]}
                                        animate={true}
                                        motionStiffness={90}
                                        motionDamping={15}
                                    />
                                </div>

                                {/* Stats Overview */}
                                <div className="bg-white p-6 rounded-xl shadow-md">
                                    <h2 className="text-lg font-semibold mb-4">Project Overview</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm text-blue-600">Total Works</p>
                                            <p className="text-2xl font-bold">{works.length}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-green-600">Completed</p>
                                            <p className="text-2xl font-bold">
                                                {works.filter(w => w.status === 'Completed').length}
                                            </p>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <p className="text-sm text-yellow-600">In Progress</p>
                                            <p className="text-2xl font-bold">
                                                {works.filter(w => w.status === 'In Progress').length}
                                            </p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <p className="text-sm text-red-600">High Priority</p>
                                            <p className="text-2xl font-bold">
                                                {works.filter(w => w.priority === 'High').length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="bg-white p-6 rounded-xl shadow-md h-96">
                                <h2 className="text-lg font-semibold mb-4">Work Timeline</h2>
                                <ResponsiveLine
                                    data={lineChartData}
                                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                                    xScale={{ type: 'point' }}
                                    yScale={{
                                        type: 'linear',
                                        min: 'auto',
                                        max: 'auto',
                                        stacked: true,
                                        reverse: false
                                    }}
                                    yFormat=" >-.2f"
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        orient: 'bottom',
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: -45,
                                        legend: 'Date',
                                        legendOffset: 36,
                                        legendPosition: 'middle'
                                    }}
                                    axisLeft={{
                                        orient: 'left',
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'Count',
                                        legendOffset: -40,
                                        legendPosition: 'middle'
                                    }}
                                    pointSize={10}
                                    pointColor={{ theme: 'background' }}
                                    pointBorderWidth={2}
                                    pointBorderColor={{ from: 'serieColor' }}
                                    pointLabelYOffset={-12}
                                    useMesh={true}
                                    legends={[
                                        {
                                            anchor: 'bottom-right',
                                            direction: 'column',
                                            justify: false,
                                            translateX: 100,
                                            translateY: 0,
                                            itemsSpacing: 0,
                                            itemDirection: 'left-to-right',
                                            itemWidth: 80,
                                            itemHeight: 20,
                                            itemOpacity: 0.75,
                                            symbolSize: 12,
                                            symbolShape: 'circle',
                                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                                        itemOpacity: 1
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                                />
                            </div>
                        )}

                        {activeTab === 'calendar' && (
                            <div className="bg-white p-6 rounded-xl shadow-md h-96">
                                <h2 className="text-lg font-semibold mb-4">Work Calendar</h2>
                                <ResponsiveCalendar
                                    data={calendarData}
                                    from={new Date(Math.min(...works.map(w => new Date(w.startDate).getTime())))}
                                    to={new Date(Math.max(...works.map(w => new Date(w.endDate).getTime())))}
                                    emptyColor="#eeeeee"
                                    colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
                                    margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                                    yearSpacing={40}
                                    monthBorderColor="#ffffff"
                                    dayBorderWidth={2}
                                    dayBorderColor="#ffffff"
                                    legends={[
                                        {
                                            anchor: 'bottom-right',
                                            direction: 'row',
                                            translateY: 36,
                                            itemCount: 4,
                                            itemWidth: 42,
                                            itemHeight: 36,
                                            itemsSpacing: 14,
                                            itemDirection: 'right-to-left'
                                        }
                                    ]}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export { WorkGraphView };