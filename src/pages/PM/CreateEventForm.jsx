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
  const [fileSpeakerList, setFileSpeakerList] = useState([[]]);
  const [location, setLocation] = useState([]);
  const [sponsor, setSponsor] = useState([]);
  const [organization, setOrganization] = useState([]);
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);
  const user = useSelector((state) => state.user.user || {});
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async (values) => {
    setIsLoading(true);
    const formData = new FormData();

    // Map the form data to match the DTO structure
    formData.append("UserId", user.id);
    formData.append("Title", values.title);
    formData.append("Description", values.description);
    formData.append(
      "StartEventDate",
      formatDateToISOString(values.eventDate[0])
    );
    formData.append(
      "EndEventDate",
      formatDateToISOString(new Date(values.eventDate[1]))
    );
    formData.append(
      "StartTime",
      formatDateToISOString(new Date(values.dateRange[0]))
    );
    formData.append(
      "EndTime",
      formatDateToISOString(new Date(values.dateRange[1]))
    );
    formData.append("LocationId", values.locationId);
    formData.append("OrganizationId", values.organizationId);

    // For arrays of objects, stringify each object
    values.createSeatRankDtoRequests.forEach((item, index) => {
      formData.append(`CreateSeatRankDtoRequests[${index}].Name`, item.name);
      formData.append(`CreateSeatRankDtoRequests[${index}].Price`, item.price);
      formData.append(
        `CreateSeatRankDtoRequests[${index}].Quantity`,
        item.quantity
      );
      formData.append(
        `CreateSeatRankDtoRequests[${index}].Description`,
        item.description
      );
      formData.append(
        `CreateSeatRankDtoRequests[${index}].StartTime`,
        formatDateToISOString(new Date(item.dateRange[0]))
      );
      formData.append(
        `CreateSeatRankDtoRequests[${index}].EndTime`,
        formatDateToISOString(new Date(item.dateRange[1]))
      );
    });

    values.sponsors.forEach((item, index) => {
      formData.append(
        `CreateEventSponsorEvents[${index}].SponsorDescription`,
        item.description
      );
      formData.append(
        `CreateEventSponsorEvents[${index}].SponsorType`,
        item.sponsorType
      );
      formData.append(
        `CreateEventSponsorEvents[${index}].MoneySponsorAmount`,
        item.moneySponsorAmount
      );
      formData.append(
        `CreateEventSponsorEvents[${index}].SponsorId`,
        item.sponsorId
      );
    });

    values.speakers.forEach((item, index) => {
      formData.append(`CreateSpeakerEvents[${index}].Name`, item.name);
      formData.append(
        `CreateSpeakerEvents[${index}].Description`,
        item.description
      );
      formData.append(
        `CreateSpeakerEvents[${index}].Img`,
        fileSpeakerList[index].file
      );
    });

    // For file inputs, append the files to the form data
    files.forEach((file, index) => {
      formData.append(`Img`, file);
    });
    const data = await createEvent(formData);
    if (data.isSuccess) {
      message.success("Tạo sự kiện thành công");
    } else {
      message.error("Tạo sự kiện không thành công");
    }
    setIsLoading(false);
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
