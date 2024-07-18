import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllEvent } from "../../api/eventApi";
import { addSponsor } from "../../api/sponsorApi";

const AddSponsorForm = ({ onSponsorAdded }) => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const [fileList, setFileList] = useState([]);

  // Fetch events from the API
  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Convert file to binary data and handle form submission
  const getBinaryDataFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result); // Binary data
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("Description", values.description);
    formData.append("PhoneNumber", values.phoneNumber);
    formData.append("Email", values.email);

    // Convert image files to binary data and append to formData
    try {
      for (const file of fileList) {
        if (file.originFileObj) {
          formData.append("Img", file.originFileObj);
        }
      }

      console.log("Sending data:", {
        name: values.name,
        description: values.description,
        phoneNumber: values.phoneNumber,
        email: values.email,
        files: fileList.map((file) => file.name),
      });

      const res = await addSponsor(formData);

      // Check for success and handle response
      if (res.isSuccess) {
        onSponsorAdded(); // Notify parent component
        form.resetFields(); // Reset form fields
        setFileList([]); // Clear file list
        message.success("Sponsor added successfully");
      } else {
        // Log error and show message
        console.error("Error response data:", res.messages);
        message.error(res.messages.join("\n"));
      }
    } catch (error) {
      // Log unexpected errors and show a message
      console.error("Error adding sponsor:", error);
      message.error("An unexpected error occurred. Please try again later.");
    }
  };

  // Handle file upload change
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Validate file type
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage; // Return false to prevent upload if not an image
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-center mb-6">
        Thêm đơn vị tài trợ
      </h3>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{}}
      >
        <Form.Item
          label="Tên nhà tài trợ"
          name="name"
          rules={[
            { required: true, message: "Please enter the sponsor's name" },
          ]}
        >
          <Input placeholder="Nhập tên nhà tài trợ" />
        </Form.Item>
        <Form.Item
          label="Mô tả chi tiết"
          name="description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input placeholder="Nhập mô tả chi tiết về nhà tài trợ" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: "Please enter the phone number" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter the email" }]}
        >
          <Input placeholder="Nhập email liên hệ" />
        </Form.Item>
        <Form.Item
          label="Hình ảnh"
          name="img"
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={beforeUpload}
            multiple
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm nhà tài trợ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddSponsorForm;
