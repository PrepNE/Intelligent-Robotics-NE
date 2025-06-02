import React from 'react';
import { Modal, Button } from 'antd';

interface DeleteConfirmationModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ visible, onConfirm, onCancel }) => {
    return (
        <Modal
            title="Confirm Deletion"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" danger onClick={onConfirm}>
                    Delete
                </Button>,
            ]}
        >
            Are you sure you want to delete this user?
        </Modal>
    );
};

export default DeleteConfirmationModal;