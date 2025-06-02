/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from "antd";
import React, { useState, useEffect } from "react";
import { paginate } from "@/lib/utils";

interface EditModalProps<T> {
  visible: boolean;
  onClose: () => void;
  item: T | null;
  title: string;
  fields: {
    name: keyof T;
    label: string;
    inputType?: "text" | "number" | "email";
    rules?: any[];
    placeholder?: string;
  }[];
  onSubmit: (updatedItem: T) => Promise<void>;
}

interface DeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface DataTableProps<T> {
  data: T[];
  searchQuery: string;
  onDelete: (id: string) => Promise<void>;
  onEdit: (item: T) => Promise<void>;
  columns: (
    selectedKey: string | null,
    handleEdit: (item: T) => void,
    handleDelete: () => void,
    handleCheckBoxChange: (key: string, item: T) => void
  ) => any[];
  rowKey: keyof T;
  EditModalComponent: React.FC<EditModalProps<T>>;
  DeleteModalComponent: React.FC<DeleteModalProps>;
  modalTitle: string;
  editFields: EditModalProps<T>["fields"];
}

const DataTable = <T extends { id: string }>({
  data,
  searchQuery,
  onDelete,
  onEdit,
  columns,
  rowKey,
  EditModalComponent,
  DeleteModalComponent,
  modalTitle,
  editFields,
}: DataTableProps<T>) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isEditModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setDeleteModalVisible] =
    useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [filteredData, setFilteredData] = useState<T[]>([]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredData(filtered);

    const totalPages = Math.ceil(filtered.length / pageSize);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [data, searchQuery, pageSize, currentPage]);

  const handleCheckBoxChange = (key: string, item: T) => {
    setSelectedKey((prevKey) => (prevKey === key ? null : key));
    setCurrentItem(item);
  };

  const handleEdit = (item: T) => {
    setCurrentItem(item);
    setEditModalVisible(true);
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (currentItem?.id) {
      await onDelete(currentItem.id);
      setDeleteModalVisible(false);
      setSelectedKey(null);
    }
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const paginatedData = paginate(filteredData, pageSize, currentPage);

  return (
    <div style={{ overflowX: "auto" }}>
      <Table<T>
        dataSource={paginatedData}
        columns={columns(
          selectedKey,
          handleEdit,
          handleDelete,
          handleCheckBoxChange
        )}
        rowKey={rowKey as string}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          showSizeChanger: true,
          pageSizeOptions: ["3", "5", "10", "20", "50"],
        }}
        onChange={handleTableChange}
      />

      {currentItem && (
        <EditModalComponent
          visible={isEditModalVisible}
          onClose={() => setEditModalVisible(false)}
          item={currentItem}
          title={modalTitle}
          fields={editFields}
          onSubmit={onEdit}
        />
      )}

      <DeleteModalComponent
        visible={isDeleteModalVisible}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default DataTable;
