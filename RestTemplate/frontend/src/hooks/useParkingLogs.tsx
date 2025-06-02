import axios from "@/lib/axios.config";
import useSWR from "swr";



export interface IParkingLog {
  id: string;
  plateNumber: string;
  paymentStatus: number;
  entryTimestamp: string;        
  paymentTimestamp?: string;     
  exitTimestamp?: string;        
  exitStatus?: string;
  amountCharged?: string;      
}


const fetcher = async (url: string) => {
  const { data } = await axios.get(url);
  return data.body;
};

const useParkingLogs = ()  => {
    const { data: logs, isLoading, error, mutate } = useSWR("/plate-logs", fetcher);

    return {
       logs,
       isLoading,
       error,
       mutate
    }
}

export default useParkingLogs;