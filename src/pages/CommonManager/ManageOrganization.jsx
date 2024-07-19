import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Table,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  updateOrganization,
} from "../../api/organizationApi"; // Điều chỉnh đường dẫn nhập khẩu nếu cần

const ManageOrganization = () => {
  const [organizations, setOrganizations] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [form] = Form.useForm();
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [files, setFiles] = useState([]);
  const user = useSelector((state) => state.user.user || {});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, [currentPage]);

  const fetchOrganizations = async () => {
    try {
      const data = await getAllOrganizations(currentPage, 10);
      if (data && data.result) {
        setOrganizations(data.result.items);
        setTotal(data.result.totalCount); // Giả sử totalCount có sẵn
      }
    } catch (error) {
      message.error("Lấy danh sách tổ chức thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteOrganization(id);
      if (result && result.isSuccess) {
        message.success("Xóa tổ chức thành công");
        fetchOrganizations(); // Làm mới danh sách tổ chức sau khi xóa
      } else {
        message.error("Xóa tổ chức thất bại: " + result.messages.join(", "));
      }
    } catch (error) {
      message.error("Lỗi khi xóa tổ chức: " + error.message);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const result = await createOrganization(formData);
      if (result && result.isSuccess) {
        message.success("Tạo tổ chức thành công");
        fetchOrganizations();
        setShowModal(false);
      } else {
        message.error("Tạo tổ chức thất bại: " + result.messages.join(", "));
      }
    } catch (error) {
      message.error("Lỗi khi tạo tổ chức: " + error.message);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const result = await updateOrganization(formData);
      if (result && result.isSuccess) {
        message.success("Cập nhật tổ chức thành công");
        fetchOrganizations();
        setShowModal(false);
      } else {
        message.error(
          "Cập nhật tổ chức thất bại: " + result.messages.join(", ")
        );
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật tổ chức: " + error.message);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      foundedDate: moment(record.foundedDate),
      contactEmail: record.contactEmail,
      website: record.website,
      address: record.address,
    });
    setSelectedOrgId(record.id);
    setModalType("update");
    setShowModal(true);
  };

  const handleModal = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      const formData = new FormData();
      formData.append("Name", values.name || "");
      formData.append("Description", values.description || "");
      formData.append(
        "FoundedDate",
        values.foundedDate ? values.foundedDate.format("YYYY-MM-DD") : null
      );
      formData.append("ContactEmail", values.contactEmail || "");
      formData.append("Website", values.website || "");
      formData.append("Address", values.address || "");
      formData.append("CreatedBy", user.name || "");

      // Đối với các đầu vào tập tin, thêm các tập tin vào dữ liệu form
      Array.from(files).forEach((file) => {
        formData.append("Img", file);
      });

      let result;
      if (modalType === "create") {
        result = await createOrganization(formData);
      } else {
        formData.append("Id", selectedOrgId);
        result = await updateOrganization(formData);
      }

      if (result && result.isSuccess) {
        message.success(
          `${modalType === "create" ? "Tạo" : "Cập nhật"} tổ chức thành công`
        );
        fetchOrganizations();
        setShowModal(false);
      } else {
        message.error(
          `${
            modalType === "create" ? "Tạo" : "Cập nhật"
          } tổ chức thất bại: ${result.messages.join(", ")}`
        );
      }
    } catch (error) {
      message.error("Gửi form thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    form.resetFields();
    setFiles([]); // Xóa các tập tin khi đóng modal
  };

  const columns = [
    {
      title: "Tên tổ chức",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Email Liên Hệ",
      dataIndex: "contactEmail",
      key: "contactEmail",
    },
    {
      title: "Ngày Thành Lập",
      dataIndex: "foundedDate",
      key: "foundedDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createDate",
      key: "createDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (text, record) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            <EditOutlined style={{ color: "green" }} />
          </Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            <DeleteOutlined style={{ color: "red" }} />
          </Button>
        </>
      ),
    },
  ];

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setShowModal(true);
          setModalType("create");
          form.resetFields();
        }}
        style={{ marginBottom: 16 }}
      >
        Tạo Tổ Chức
      </Button>
      <Table
        dataSource={organizations}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={isLoading}
      />
      <Pagination
        current={currentPage}
        total={total}
        pageSize={10}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 16 }}
      />

      <Modal
        title={modalType === "create" ? "Tạo Tổ Chức" : "Cập Nhật Tổ Chức"}
        visible={showModal}
        onOk={handleModal}
        onCancel={handleModalCancel}
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên tổ chức",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả tổ chức",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="foundedDate"
            label="Ngày Thành Lập"
            rules={[
              { required: true, message: "Vui lòng nhập ngày thành lập" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="contactEmail"
            label="Email Liên Hệ"
            rules={[{ required: true, message: "Vui lòng nhập email liên hệ" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
            rules={[{ required: true, message: "Vui lòng nhập website" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa Chỉ">
            <Input />
          </Form.Item>
          <Form.Item label="Tải Lên Hình Ảnh">
            <input type="file" multiple onChange={handleFileChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageOrganization;
