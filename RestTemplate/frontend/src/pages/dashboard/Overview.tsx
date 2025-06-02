import StatsCard from "@/components/cards/StatCard";
import useParkingLogs from "@/hooks/useParkingLogs";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { TooltipProps } from 'recharts';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from "recharts";

export default function Overview() {
    const { logs, isLoading } = useParkingLogs();

    const dashboardData = useMemo(() => {
        if (!logs || !Array.isArray(logs)) {
            return {
                totalEntries: 0,
                paidEntries: 0,
                unpaidEntries: 0,
                completedSessions: 0,
                activeSessions: 0,
                paymentStatusData: [],
                exitStatusData: [],
                dailyTrends: []
            };
        }

        const totalEntries = logs.length;
        const paidEntries = logs.filter(log => log.paymentStatus === 1).length;
        const unpaidEntries = logs.filter(log => log.paymentStatus === 0).length;
        const completedSessions = logs.filter(log => log.exitTimestamp).length;
        const activeSessions = logs.filter(log => !log.exitTimestamp).length;

        const paymentStatusData = [
            { name: "Paid", value: paidEntries, color: "#10b981" },
            { name: "Unpaid", value: unpaidEntries, color: "#ef4444" }
        ].filter(item => item.value > 0);
        const dailyTrends = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayPaid = logs.filter(log => {
                const logDate = new Date(log.entryTimestamp).toISOString().split('T')[0];
                return logDate === dateStr && log.paymentStatus === 1;
            }).length;

            const dayUnpaid = logs.filter(log => {
                const logDate = new Date(log.entryTimestamp).toISOString().split('T')[0];
                return logDate === dateStr && log.paymentStatus === 0;
            }).length;

            const dayEntries = logs.filter(log => {
                const logDate = new Date(log.entryTimestamp).toISOString().split('T')[0];
                return logDate === dateStr;
            }).length;

            dailyTrends.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                paid: dayPaid,
                unpaid: dayUnpaid,
                total: dayEntries
            });
        }
        const exitStatusCounts = logs.reduce((acc, log) => {
            if (log.exitStatus) {
                acc[log.exitStatus] = (acc[log.exitStatus] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const exitStatusData = Object.entries(exitStatusCounts).map(([status, count]) => ({
            status: status.charAt(0).toUpperCase() + status.slice(1),
            count
        }));

        return {
            totalEntries,
            paidEntries,
            unpaidEntries,
            completedSessions,
            activeSessions,
            paymentStatusData,
            exitStatusData,
            dailyTrends
        };
    }, [logs]);

    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            <span className="capitalize">{entry.dataKey}:</span>{" "}
                            <span className="font-semibold">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const CustomPieTooltip = ({ active, payload }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{data.name}</p>
                    <p className="text-sm text-gray-600">
                        Count: <span className="font-semibold">{data.value}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Percentage:{" "}
                        <span className="font-semibold">
                            {((data.value as number / dashboardData.totalEntries) * 100).toFixed(1)}%
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center min-h-[400px]">
                <div className="text-lg text-gray-500">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Overview</title>
            </Helmet>
            <div className="w-full flex flex-col gap-y-6">
                <div>
                    <h2 className="text-2xl font-semibold">Overview</h2>
                    <p className="text-gray-500">Hello there! here is a summary for you</p>
                </div>
                <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Entries"
                        value={dashboardData.totalEntries}
                        link="/dashboard/logs"
                    />
                    <StatsCard
                        title="Paid Entries"
                        value={dashboardData.paidEntries}
                        link="/dashboard/logs"
                    />
                    <StatsCard
                        title="Unpaid Entries"
                        value={dashboardData.unpaidEntries}
                        link="/dashboard/logs"
                    />
                    <StatsCard
                        title="Active Sessions"
                        value={dashboardData.activeSessions}
                        link="/dashboard/logs"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Payment Status</h3>
                                <p className="text-gray-600 text-sm mt-1">Current payment breakdown</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">{dashboardData.totalEntries}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Entries</p>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={dashboardData.paymentStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={120}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {dashboardData.paymentStatusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            stroke={entry.color}
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{
                                        paddingTop: '20px',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Weekly Trends */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Daily Entry Trends</h3>
                                <p className="text-gray-600 text-sm mt-1">Last 7 days activity</p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">Paid</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-600">Unpaid</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-600">Total</span>
                                </div>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart
                                data={dashboardData.dailyTrends}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="paid"
                                    stroke="#059669"
                                    strokeWidth={2}
                                    dot={{ fill: "#059669", strokeWidth: 2, r: 3 }}
                                    activeDot={{ r: 5, stroke: "#059669", strokeWidth: 2, fill: "#fff" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="unpaid"
                                    stroke="#dc2626"
                                    strokeWidth={2}
                                    dot={{ fill: "#dc2626", strokeWidth: 2, r: 3 }}
                                    activeDot={{ r: 5, stroke: "#dc2626", strokeWidth: 2, fill: "#fff" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Additional Charts Row */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Exit Status Bar Chart - Only show if data exists */}
                    {dashboardData.exitStatusData.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold mb-4">Exit Status Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dashboardData.exitStatusData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="status" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Payment Rate Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h3 className="text-lg font-semibold mb-4">Payment Statistics</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Payment Rate</span>
                                <span className="text-2xl font-bold text-green-600">
                                    {dashboardData.totalEntries > 0
                                        ? Math.round((dashboardData.paidEntries / dashboardData.totalEntries) * 100)
                                        : 0}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${dashboardData.totalEntries > 0
                                            ? (dashboardData.paidEntries / dashboardData.totalEntries) * 100
                                            : 0}%`
                                    }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {dashboardData.paidEntries} paid out of {dashboardData.totalEntries} total entries
                            </div>

                            {/* Session Status */}
                            <div className="pt-4 border-t">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">{dashboardData.activeSessions}</p>
                                        <p className="text-xs text-gray-500">Active Sessions</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-600">{dashboardData.completedSessions}</p>
                                        <p className="text-xs text-gray-500">Completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}