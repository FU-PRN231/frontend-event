import { Button, Form, message, Modal, Select, Spin } from "antd";
import React, { useState } from "react";
import { assignRoleToUser } from "../../api/accountApi"; // Ensure the import path is correct

const { Option } = Select;

const AssignRoleForm = ({
  visible,
  onClose,
  userId,
  fetchData,
  currentPage,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { value: "customer", displayName: "Khách hàng" },
    { value: "admin", displayName: "Quản trị viên" },
    { value: "organizer", displayName: "Nhà tổ chức" },
    { value: "staff", displayName: "Nhân viên" },
    { value: "pm", displayName: "Quản lý dự án" },
  ];

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      await assignRoleToUser(userId, values.roleName);
      message.success("Cập nhật vai trò thành công");
      fetchData(currentPage); // Refresh data if needed
      onClose(); // Close modal after success
    } catch (error) {
      message.error("Failed to assign role.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Assign Role"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ roleName: "" }}
        >
          <Form.Item
            name="roleName"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              {roles.map((role) => (
                <Option key={role.value} value={role.value}>
                  {role.displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Assign Role
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AssignRoleForm;
