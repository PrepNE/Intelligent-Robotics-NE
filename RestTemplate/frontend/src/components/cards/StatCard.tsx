import { Link } from "react-router-dom"


const StatsCard = ({ title, value, link }: {
    title: string, value: string | number, link: string
}) => {
    return (
        <div className="w-full p-6 flex flex-col items-center gap-y-3 shadow-lg rounded-md border">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-4xl font-bold">{value}</p>
            <Link to={link} className="text-blue-600 hover:underline">View more &rarr;</Link>
        </div>
    )
}

export default StatsCard;