/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import SearchInput from "@/components/shared/SearchInput";
import { Button, Tag, Checkbox } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import EditModal from "@/components/modals/EditModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import DataTable from "@/components/tables/DataTable";

interface Slot {
  id: string;
  name: string;
  status: "available" | "occupied";
  price: number;
  location: string;
}

const dummySlots: Slot[] = [
  { id: "1", name: "Slot A1", status: "available", price: 1000, location: "Level 1" },
  { id: "2", name: "Slot B2", status: "occupied", price: 1500, location: "Level 2" },
  { id: "3", name: "Slot C3", status: "available", price: 1200, location: "Level 3" },
   { id: "4", name: "Slot A1", status: "available", price: 1000, location: "Level 1" },
  { id: "5", name: "Slot B2", status: "occupied", price: 1500, location: "Level 2" },
  { id: "6", name: "Slot C3", status: "available", price: 1200, location: "Level 3" },
   { id: "7", name: "Slot A1", status: "available", price: 1000, location: "Level 1" },
  { id: "8", name: "Slot B2", status: "occupied", price: 1500, location: "Level 2" },
  { id: "9", name: "Slot C3", status: "available", price: 1200, location: "Level 3" },
];

const Slots = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>(dummySlots);

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = async (id: string) => {
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
  };

  const handleEdit = async (updatedSlot: Slot) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === updatedSlot.id ? updatedSlot : slot))
    );
  };

  const columns = (
    selectedKey: string | null,
    handleEditRow: (slot: Slot) => void,
    handleDeleteRow: () => void,
    handleCheckBoxChange: (key: string, item: Slot) => void
  ) => {
    const baseColumns = [
      {
        title: "",
        key: "checkbox",
        render: (_: any, record: Slot) => (
          <Checkbox
            checked={record.id === selectedKey}
            onChange={() => handleCheckBoxChange(record.id, record)}
          />
        ),
      },
      { title: "Name", dataIndex: "name", key: "name" },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text: string) => (
          <Tag color={text === "available" ? "green" : "red"}>{text}</Tag>
        ),
      },
      { title: "Price", dataIndex: "price", key: "price" },
      { title: "Location", dataIndex: "location", key: "location" },
    ];

    const actionColumn = {
      title: "Action",
      key: "action",
      render: (_: any, record: Slot) =>
        record.id === selectedKey ? (
          <span className="flex flex-1 flex-row gap-x-4">
            <Button onClick={() => handleEditRow(record)}>
              <EditOutlined /> Edit
            </Button>
            <Button danger onClick={handleDeleteRow}>
              <DeleteOutlined /> Delete
            </Button>
          </span>
        ) : null,
    };

    return selectedKey ? [...baseColumns, actionColumn] : baseColumns;
  };

  return (
    <div className="bg-white px-10 py-6 rounded-lg">
      <div className="flex flex-1 sm:flex-row flex-col gap-y-4 justify-between pb-6">
        <div>
          <h1 className="text-base font-medium">Manage Parking Slots</h1>
          <p className="text-gray-500 text-[14px]">
            Extract and manipulate the slots over here!
          </p>
        </div>
        <div className="flex flex-row gap-x-2">
          <SearchInput
            searchQueryValue={searchValue}
            handleSearchQueryValue={handleSearchQueryChange}
          />
        </div>
      </div>

      <DataTable<Slot>
        data={slots}
        searchQuery={searchValue}
        onDelete={handleDelete}
        onEdit={handleEdit}
        columns={columns}
        rowKey="id"
        EditModalComponent={EditModal}
        DeleteModalComponent={DeleteConfirmationModal}
        modalTitle="Edit Parking Slot"
        editFields={[
          {
            name: "name",
            label: "Slot Name",
            placeholder: "e.g. Slot A1",
            rules: [{ required: true, message: "Slot name is required" }],
          },
          {
            name: "price",
            label: "Slot Price",
            inputType: "number",
            placeholder: "Enter price",
            rules: [{ required: true, message: "Price is required" }],
          },
          {
            name: "location",
            label: "Location",
            placeholder: "e.g. Basement Level 2",
            rules: [{ required: true, message: "Location is required" }],
          },
          {
            name: "status",
            label: "Status",
            placeholder: "available / occupied",
            rules: [{ required: true, message: "Status is required" }],
          },
        ]}
      />
    </div>
  );
};

export default Slots;
