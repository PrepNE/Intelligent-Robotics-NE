/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import SearchInput from "@/components/shared/SearchInput";
import { Button, Tag, Checkbox, Select, DatePicker, Space, Badge } from "antd";
import { DeleteOutlined, EditOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import EditModal from "@/components/modals/EditModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import DataTable from "@/components/tables/DataTable";
import useParkingLogs, { IParkingLog } from "@/hooks/useParkingLogs";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface FilterState {
  paymentStatus: 'all' | 'paid' | 'unpaid';
  sessionStatus: 'all' | 'active' | 'completed';
  exitStatus: 'all' | string;
}

const Logs = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({
    paymentStatus: 'all',
    sessionStatus: 'all',
    exitStatus: 'all'
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const { logs, isLoading } = useParkingLogs();

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue(event.target.value);
  };

  const uniqueExitStatuses = useMemo(() => {
    if (!logs) return [];
    const statuses = logs
      .map((log: IParkingLog) => log.exitStatus)
      .filter((status: any): status is string => Boolean(status))
      .filter((status: string, index: number, arr: string[]) => arr.indexOf(status) === index);
    return statuses;
  }, [logs]);

  const filteredLogs = useMemo(() => {
    if (!logs) return [];

    let filtered = logs.filter((log: IParkingLog) => {
      const searchMatch =
        log.plateNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
        log.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        (log.exitStatus && log.exitStatus.toLowerCase().includes(searchValue.toLowerCase()));

      if (!searchMatch) return false;


      if (filters.paymentStatus !== 'all') {
        const isPaid = log.paymentStatus === 1;
        if (filters.paymentStatus === 'paid' && !isPaid) return false;
        if (filters.paymentStatus === 'unpaid' && isPaid) return false;
      }

      if (filters.sessionStatus !== 'all') {
        const isCompleted = Boolean(log.exitTimestamp);
        if (filters.sessionStatus === 'completed' && !isCompleted) return false;
        if (filters.sessionStatus === 'active' && isCompleted) return false;
      }

      if (filters.exitStatus !== 'all') {
        if (log.exitStatus !== filters.exitStatus) return false;
      }



      return true;
    });

    return filtered;
  }, [logs, searchValue, filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      paymentStatus: 'all',
      sessionStatus: 'all',
      exitStatus: 'all'
    });
    setSearchValue("");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.paymentStatus !== 'all') count++;
    if (filters.sessionStatus !== 'all') count++;
    if (filters.exitStatus !== 'all') count++;
    if (searchValue) count++;
    return count;
  };

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return '-';
    return dayjs(timestamp).format('MMM DD, YYYY HH:mm');
  };

  const calculateDuration = (entry: string, exit?: string) => {
    if (!exit) return 'Active';
    const duration = dayjs(exit).diff(dayjs(entry), 'minutes');
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const columns = (
    selectedKey: string | null,
    handleEditRow: (log: IParkingLog) => void,
    handleDeleteRow: () => void,
    handleCheckBoxChange: (key: string, item: IParkingLog) => void
  ) => {
    const baseColumns = [
      {
        title: "",
        key: "checkbox",
        width: 50,
        render: (_: any, record: IParkingLog) => (
          <Checkbox
            checked={record.id === selectedKey}
            onChange={() => handleCheckBoxChange(record.id, record)}
          />
        ),
      },
      {
        title: "Plate Number",
        dataIndex: "plateNumber",
        key: "plateNumber",
        width: 120,
        render: (text: string) => (
          <span className="font-mono font-semibold text-gray-800">{text}</span>
        )
      },
      {
        title: "Payment Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        width: 120,
        render: (status: number) => (
          <Tag color={status === 1 ? "success" : "error"}>
            {status === 1 ? "Paid" : "Unpaid"}
          </Tag>
        ),
      },
      {
        title: "Session Status",
        key: "sessionStatus",
        width: 120,
        render: (_: any, record: IParkingLog) => (
          <Tag color={record.exitTimestamp ? "default" : "processing"}>
            {record.exitTimestamp ? "Completed" : "Active"}
          </Tag>
        ),
      },
      {
        title: "Entry Time",
        dataIndex: "entryTimestamp",
        key: "entryTimestamp",
        width: 150,
        render: (timestamp: string) => (
          <span className="text-sm text-gray-600">{formatTimestamp(timestamp)}</span>
        ),
      },
      {
        title: "Exit Time",
        dataIndex: "exitTimestamp",
        key: "exitTimestamp",
        width: 150,
        render: (timestamp: string | undefined) => (
          <span className="text-sm text-gray-600">{formatTimestamp(timestamp)}</span>
        ),
      },
      {
        title: "Duration",
        key: "duration",
        width: 100,
        render: (_: any, record: IParkingLog) => (
          <span className="text-sm font-medium">
            {calculateDuration(record.entryTimestamp, record.exitTimestamp)}
          </span>
        ),
      },
      {
        title: "Payment Time",
        dataIndex: "paymentTimestamp",
        key: "paymentTimestamp",
        width: 150,
        render: (timestamp: string | undefined) => (
          <span className="text-sm text-gray-600">{formatTimestamp(timestamp)}</span>
        ),
      },
      {
        title: "Exit Status",
        dataIndex: "exitStatus",
        key: "exitStatus",
        width: 120,
        render: (status: string | undefined) =>
          status ? (
            <Tag color="blue">{status}</Tag>
          ) : (
            <span className="text-gray-400">-</span>
          )
      },
    ];

    return baseColumns;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-white px-10 py-6 rounded-lg">
      <div className="flex flex-1 sm:flex-row flex-col gap-y-4 justify-between pb-6">
        <div>
          <h1 className="text-base font-medium">Parking Logs</h1>
          <p className="text-gray-500 text-[14px]">
            View and manage parking session records
          </p>
        </div>
        <div className="flex items-center flex-row gap-x-2">
          <SearchInput
            searchQueryValue={searchValue}
            handleSearchQueryValue={handleSearchQueryChange}
          />
          <Badge count={activeFilterCount} size="small">
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? "primary" : "default"}
            >
              Filters
            </Button>
          </Badge>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Payment Status</label>
                <Select
                  value={filters.paymentStatus}
                  onChange={(value) => handleFilterChange('paymentStatus', value)}
                  style={{ width: 120 }}
                  size="small"
                >
                  <Option value="all">All</Option>
                  <Option value="paid">Paid</Option>
                  <Option value="unpaid">Unpaid</Option>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Session Status</label>
                <Select
                  value={filters.sessionStatus}
                  onChange={(value) => handleFilterChange('sessionStatus', value)}
                  style={{ width: 120 }}
                  size="small"
                >
                  <Option value="all">All</Option>
                  <Option value="active">Active</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </div>

              {uniqueExitStatuses.length > 0 && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">Exit Status</label>
                  <Select
                    value={filters.exitStatus}
                    onChange={(value) => handleFilterChange('exitStatus', value)}
                    style={{ width: 120 }}
                    size="small"
                  >
                    <Option value="all">All</Option>
                    {uniqueExitStatuses.map((status: string) => (
                      <Option key={status} value={status}>{status}</Option>
                    ))}
                  </Select>
                </div>
              )}
            </div>


            <div className="flex items-end justify-center">
              <Button
                icon={<ClearOutlined />}
                onClick={clearFilters}
                size="small"
                type="text"
                className="text-gray-500"
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Showing {filteredLogs.length} of {logs?.length || 0} records</span>
              {activeFilterCount > 0 && (
                <span className="text-blue-600">
                  {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <DataTable<IParkingLog>
        data={filteredLogs}
        searchQuery=""
        columns={columns}
        rowKey="id"
        DeleteModalComponent={DeleteConfirmationModal}
      />
    </div>
  );
};

export default Logs;