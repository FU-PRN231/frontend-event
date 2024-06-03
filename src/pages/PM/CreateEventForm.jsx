import React from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  InputNumber,
  Space,
  Select,
  Row,
  Col,
  Card,
  Divider,
} from "antd";

const CreateEventForm = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const locationIds = ["Location 1", "Location 2", "Location 3"];
  const organizationIds = [
    "Organization 1",
    "Organization 2",
    "Organization 3",
  ];

  return (
    <div className="container">
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card title="Thông tin sự kiện">
              {/* <Form.Item
                label="User ID"
                name="userId"
                rules={[
                  { required: true, message: "Please input the user ID!" },
                ]}
              >
                <Input style={{ width: "100%" }} placeholder="User ID" />
              </Form.Item> */}

              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: "Please input the title!" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Tiêu đề sự kiện"
                />
              </Form.Item>

              <Form.Item
                label="Mô tả sự kiện"
                name="description"
                rules={[
                  { required: true, message: "Please input the description!" },
                ]}
              >
                <Input.TextArea
                  style={{ width: "100%" }}
                  placeholder="Mô tả sự kiện"
                />
              </Form.Item>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card title="Thông tin về thời gian sự kiện">
              <Form.Item
                label="Ngày sự kiện"
                name="eventDate"
                rules={[
                  { required: true, message: "Please input the event date!" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  placeholder="Event Date"
                />
              </Form.Item>

              <Form.Item
                label="Thời gian bắt đầu"
                name="startTime"
                rules={[
                  { required: true, message: "Please input the start time!" },
                ]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  placeholder="Thời gian bắt đầu"
                />
              </Form.Item>

              <Form.Item
                label="Thời gian kết thúc"
                name="endTime"
                rules={[
                  { required: true, message: "Please input the end time!" },
                ]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  placeholder="Thời gian kết thúc"
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card title="Địa điểm và ban tổ chức">
              <Form.Item
                label="Địa điểm sự kiện"
                name="locationId"
                rules={[
                  { required: true, message: "Please input the location ID!" },
                ]}
              >
                <Select style={{ width: "100%" }} placeholder="Chọn địa điểm">
                  {locationIds.map((id) => (
                    <Select.Option key={id} value={id}>
                      {id}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Ban tổ chức sự kiện"
                name="organizationId"
                rules={[
                  {
                    required: true,
                    message: "Chọn ban tổ chức sự kiện!",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Chọn ban tổ chức sự kiện"
                >
                  {organizationIds.map((id) => (
                    <Select.Option key={id} value={id}>
                      {id}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card title="Hạng ghế">
              <Form.List name="createSeatRankDtoRequests">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <Row
                        gutter={16}
                        key={field.key}
                        style={{ marginBottom: 16 }}
                      >
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, "name"]}
                            label="Tên hạng ghế"
                            rules={[
                              {
                                required: true,
                                message: "Tên hạng ghế bắt buộc",
                              },
                            ]}
                          >
                            <Input placeholder="Tên hạng ghế" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, "startTime"]}
                            label="Thời gian bắt đầu"
                            rules={[
                              {
                                required: true,
                                message: "Thời gian bắt đầu bắt buộc",
                              },
                            ]}
                          >
                            <TimePicker placeholder="Thời gian bắt đầu" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, "endTime"]}
                            label="Thời gian kết thúc"
                            rules={[
                              {
                                required: true,
                                message: "Thời gian kết thúc bắt buộc",
                              },
                            ]}
                          >
                            <TimePicker placeholder="Thời gian kết thúc" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8}>
                          <Form.Item
                            {...field}
                            name={[field.name, "remainingCapacity"]}
                            label="Số lượng còn lại"
                            rules={[
                              {
                                required: true,
                                message: "Số lượng còn lại bắt buộc",
                              },
                            ]}
                          >
                            <InputNumber
                              min={0}
                              placeholder="Số lượng còn lại"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, "price"]}
                            label="Giá"
                            rules={[
                              { required: true, message: "Giá bắt buộc" },
                            ]}
                          >
                            <InputNumber min={0} placeholder="Giá" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, "description"]}
                            label="Mô tả"
                            rules={[
                              { required: true, message: "Mô tả bắt buộc" },
                            ]}
                          >
                            <Input.TextArea placeholder="Mô tả" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, "quantity"]}
                            label="Số lượng"
                            rules={[
                              { required: true, message: "Số lượng bắt buộc" },
                            ]}
                          >
                            <InputNumber min={0} placeholder="Số lượng" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} style={{ textAlign: "right" }}>
                          <Button onClick={() => remove(field.name)}>
                            Xóa
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block>
                        Thêm hạng ghế
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={{ span: 8, offset: 8 }}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", marginTop: 16 }}
              >
                Tạo sự kiện
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateEventForm;
