import React, { useEffect, useState } from "react";
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
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { sponsorType } from "../../utils/labelEnum";
import { Trash2Icon, TrashIcon } from "lucide-react";
import { createEvent } from "../../api/eventApi";
import { formatDateToISOString } from "../../utils/util";
import { getAllAvailableLocations } from "../../api/locationApi";
import { getAllSponsors } from "../../api/sponsorApi";
import { getAllOrganizations } from "../../api/organizationApi";
import { useSelector } from "react-redux";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
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
    formData.append("OrganizationId", user.organizationId);

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

  const handleSpeakerUpload = (event, index) => {
    debugger;
    const file = event.target.files[0];
    setFileSpeakerList((prevSpeakers) => {
      const newSpeakers = [...prevSpeakers];
      newSpeakers[index].file = file;
      return newSpeakers;
    });
  };
  console.log(fileSpeakerList);
  const handleChangeEventDate = async (value) => {
    debugger;
    const data = await getAllAvailableLocations(
      formatDateToISOString(new Date(value[0])),
      formatDateToISOString(new Date(value[1]))
    );
    if (data.isSuccess) {
      setLocation(data.result);
    }
  };
  const fetchData = async () => {
    const [data1, data2] = await Promise.all([
      getAllOrganizations(1, 100),
      getAllSponsors(),
    ]);
    if (data1.isSuccess && data2.isSuccess) {
      debugger;
      setOrganization(data1.result.items);
      setSponsor(data2.result.items);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = (event) => {
    setFiles([...event.target.files]);
  };
  return (
    <div className="container">
      <LoadingComponent isLoading={isLoading} />

      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <div className="my-10">
          <div>
            <div className="shadow-md rounded-md p-4">
              {/* <Form.Item
                label="User ID"
                name="userId"
                rules={[
                  { required: true, message: "Please input the user ID!" },
                ]}
              >
                <Input style={{ width: "100%" }} placeholder="User ID" />
              </Form.Item> */}
              <h1 className="text-center text-primary font-bold text-xl my-4">
                Thông tin sự kiện
              </h1>
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
              <Form.Item
                label="Ngày sự kiện"
                name="eventDate"
                rules={[
                  { required: true, message: "Please input the event date!" },
                ]}
              >
                <DatePicker.RangePicker
                  showTime
                  format="DD-MM-YYYY HH:mm:ss"
                  placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
                  onChange={(value) => handleChangeEventDate(value)}
                />
              </Form.Item>

              <Form.Item
                name={["dateRange"]}
                label="Thời gian mở bán vé"
                rules={[
                  {
                    required: true,
                    message: "Thời gian bắt đầu và kết thúc bắt buộc",
                  },
                ]}
              >
                <DatePicker.RangePicker
                  showTime
                  format="DD-MM-YYYY HH:mm:ss"
                  placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
                />
              </Form.Item>
              <Form.Item
                label="Địa điểm sự kiện"
                name="locationId"
                rules={[
                  { required: true, message: "Please input the location ID!" },
                ]}
              >
                <Select style={{ width: "100%" }} placeholder="Chọn địa điểm">
                  {location.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {`${item.name} - ${item.address}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Ban tổ chức sự kiện"
                name="organizationId"
               hidden
              >
               <Input hidden/>
              </Form.Item>
              <div className="form-group">
                <label className="label">
                  <span className="label-text">Hình ảnh sự kiện</span>
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleUpload}
                  className="input input-bordered"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-md shadow-md p-4">
          <div>
            <div>
              <Form.List name="createSeatRankDtoRequests">
                {(fields, { add, remove }) => (
                  <div>
                    <h1 className="font-bold text-center text-primary text-xl">
                      Hạng ghế
                    </h1>
                    {fields.map((field, index) => (
                      <div
                        gutter={16}
                        key={field.key}
                        style={{ marginBottom: 16 }}
                      >
                        <div className="relative">
                          <div className="grid grid-cols-12">
                            <Divider orientation="left" className="col-span-12">
                              Hạng ghế {index + 1}
                            </Divider>

                            <TrashIcon
                              className="text-red-500 absolute right-0 cursor-pointer"
                              onClick={() => remove(field.name)}
                            />
                          </div>
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
                            <Input
                              placeholder="Tên hạng ghế"
                              className="w-full"
                            />
                          </Form.Item>
                        </div>
                        <Col xs={24} sm={24}>
                          <Form.Item
                            {...field}
                            name={[field.name, "dateRange"]}
                            label="Thời gian mở bán"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Thời gian bắt đầu và kết thúc bắt buộc",
                              },
                            ]}
                          >
                            <DatePicker.RangePicker
                              showTime
                              format="DD-MM-YYYY HH:mm:ss"
                              placeholder={[
                                "Thời gian bắt đầu",
                                "Thời gian kết thúc",
                              ]}
                              className="w-full"
                            />
                          </Form.Item>
                        </Col>
                        <Row>
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
                              name={[field.name, "quantity"]}
                              label="Số lượng"
                              rules={[
                                {
                                  required: true,
                                  message: "Số lượng bắt buộc",
                                },
                              ]}
                            >
                              <InputNumber min={0} placeholder="Số lượng" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <div>
                          <Form.Item
                            {...field}
                            name={[field.name, "description"]}
                            label="Mô tả"
                            rules={[
                              { required: true, message: "Mô tả bắt buộc" },
                            ]}
                          >
                            <Input.TextArea
                              placeholder="Mô tả"
                              className="w-full"
                            />
                          </Form.Item>
                        </div>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        className="bg-primary text-white"
                        onClick={() => add()}
                        block
                      >
                        Thêm hạng ghế
                      </Button>
                    </Form.Item>
                  </div>
                )}
              </Form.List>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 space-x-3 mt-4">
          <div className="shadow-md rounded-md p-4">
            <h1 className="text-xl text-center font-bold text-primary">
              Nhà tài trợ
            </h1>

            <Form.List name="sponsors">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      <div className="relative">
                        <div className="grid grid-cols-12">
                          <Divider orientation="left" className="col-span-12">
                            Nhà tài trợ {index + 1}
                          </Divider>

                          <TrashIcon
                            className="text-red-500 absolute right-0 cursor-pointer"
                            onClick={() => remove(field.name)}
                          />
                        </div>
                      </div>
                      <div>
                        <Form.Item
                          label="Hình thức tài trợ"
                          name={[field.name, "sponsorType"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn hình thức tài trợ",
                            },
                          ]}
                        >
                          <Select placeholder="Chọn hình thức tài trợ">
                            {Object.entries(sponsorType).map(
                              ([value, label]) => (
                                <Select.Option key={value} value={value}>
                                  {label}
                                </Select.Option>
                              )
                            )}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="Chọn nhà tài trợ"
                          name={[field.name, "sponsorId"]}
                          rules={[
                            {
                              required: true,
                              message: "Please input the sponsor ID!",
                            },
                          ]}
                        >
                          <Select placeholder="Chọn nhà tài trợ">
                            {sponsor.map((item) => (
                              <Select.Option key={item.id} value={item.id}>
                                {item.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name={[field.name, "description"]}
                          label="Mô tả"
                          rules={[
                            {
                              required: true,
                              message: "Please input the sponsor description!",
                            },
                          ]}
                        >
                          <Input.TextArea placeholder="Mô tả thêm về nhà tài trợ" />
                        </Form.Item>

                        <Form.Item
                          label="Số tiền tài trợ"
                          name={[field.name, "moneySponsorAmount"]}
                        >
                          <InputNumber
                            className="w-full"
                            min={0}
                            placeholder="Nhập số tiền tài trợ"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                  <Button
                    className="bg-primary text-white"
                    onClick={() => add()}
                    block
                  >
                    Thêm nhà tài trợ
                  </Button>
                </>
              )}
            </Form.List>
          </div>

          <div className="rounded-md shadow-md p-4">
            <h1 className="text-center text-primary font-bold text-xl">
              Diễn giả
            </h1>
            <Form.List name="speakers">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      <div className="relative">
                        <div className="grid grid-cols-12">
                          <Divider orientation="left" className="col-span-12">
                            Diễn giả {index + 1}
                          </Divider>

                          <TrashIcon
                            className="text-red-500 absolute right-0 cursor-pointer"
                            onClick={() => remove(field.name)}
                          />
                        </div>
                      </div>
                      <div>
                        <Form.Item
                          label="Tên diễn giả"
                          name={[field.name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Please input the speaker's name!",
                            },
                          ]}
                        >
                          <Input placeholder="Tên diễn giả" />
                        </Form.Item>

                        <Form.Item
                          label="Mô tả"
                          name={[field.name, "description"]}
                          rules={[
                            {
                              required: true,
                              message:
                                "Please input the speaker's description!",
                            },
                          ]}
                        >
                          <Input placeholder="Mô tả" />
                        </Form.Item>

                        <Form.Item
                          label="Hình"
                          name={[field.name, `image${index}`]}
                          required
                        >
                          <div className="form-group">
                            <label className="label">
                              <span className="label-text">
                                Hình ảnh sự kiện
                              </span>
                            </label>
                            <input
                              type="file"
                              multiple
                              onChange={(event) =>
                                handleSpeakerUpload(event, index)
                              }
                              className="input input-bordered"
                            />
                          </div>
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                  <Button
                    className="bg-primary text-white"
                    onClick={() => add()}
                    block
                  >
                    Thêm diễn giả
                  </Button>
                </>
              )}
            </Form.List>
          </div>
        </div>
        <div>
          <div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", marginTop: 16 }}
              >
                Tạo sự kiện
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateEventForm;
