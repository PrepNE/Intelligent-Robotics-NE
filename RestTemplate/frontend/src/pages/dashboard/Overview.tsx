import StatsCard from "@/components/cards/StatCard";
import useParkingLogs from "@/hooks/useParkingLogs";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
export default function Overview() {

    const { logs } = useParkingLogs();
    console.log("Here are all the logs: ", logs)
    
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
                <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <StatsCard title="Vehicles" value={0} link="/dashboard/slots" />
                </div>
            </div>
        </>
    )
}

