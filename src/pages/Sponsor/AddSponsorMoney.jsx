import { Button, Form, Input, Select, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllEvent } from "../../api/eventApi";
import { addSponsorMoneyToEvent, getAllSponsors } from "../../api/sponsorApi";

const { Option } = Select;

const AddSponsorMoney = ({ eventId, onSponsorAdded }) => {
  const [form] = Form.useForm();

  const SponsorType = {
    MONEY_FULL_SPONSOR: 0,
    MONEY_PARTIAL_SPONSOR: 1,
    GIFT_SPONSOR: 2,
    BOOTH_SPONSOR: 3,
  };

  const [selectedEventId, setSelectedEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvent(1, 100);
        setEvents(eventsData.result.items);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const sponsorsData = await getAllSponsors(1, 10);

        if (
          sponsorsData.isSuccess &&
          sponsorsData.result &&
          sponsorsData.result.items
        ) {
          setSponsors(sponsorsData.result.items);
        } else {
          console.error(
            "getAllSponsors() did not return the expected data:",
            sponsorsData
          );
        }
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };

    fetchSponsors();
  }, []);

  const onFinish = async (values) => {
    try {
      const { sponsorItems } = values;
      sponsorItems.forEach((item) => {
        item.sponsorType = SponsorType[item.sponsorType];
      });

      const response = await addSponsorMoneyToEvent(
        selectedEventId,
        sponsorItems
      );

      if (response.isSuccess) {
        form.resetFields(); // Reset form fields
        if (typeof onSponsorAdded === "function") {
          onSponsorAdded(); // Notify parent component of the update
        }
        // Show success message
        message.success("Sponsor money added successfully!");
      } else {
        console.error(response.messages.join(", "));
        // Show error message
        message.error("Failed to add sponsor money. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding sponsor money:", error);
      // Show error message
      message.error("Error adding sponsor money. Please try again later.");
    }
  };

  const validateAmount = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Money Sponsor Amount is required"));
    }
    const regex = /^[0-9]*$/;
    if (!regex.test(value)) {
      return Promise.reject(new Error("Please enter a valid number"));
    }
    if (parseInt(value) <= 0) {
      return Promise.reject(new Error("Amount must be greater than 0"));
    }
    return Promise.resolve();
  };

  const handleEventChange = (value) => {
    setSelectedEventId(value);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Kinh phí hỗ trợ sự kiện</h2>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.List name="sponsorItems">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} direction="vertical" style={{ width: "100%" }}>
                  <Form.Item
                    label="Sự kiện"
                    name={[name, "eventId"]}
                    fieldKey={[fieldKey, "eventId"]}
                    rules={[
                      { required: true, message: "Please select an event" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn sự kiện"
                      value={selectedEventId}
                      onChange={handleEventChange}
                    >
                      {events.map((event) => (
                        <Option key={event.id} value={event.id}>
                          {event.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Hình thức tài trợ"
                    name={[name, "sponsorType"]}
                    fieldKey={[fieldKey, "sponsorType"]}
                    rules={[
                      {
                        required: true,
                        message: "Please select a sponsor type",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn loại tài trợ">
                      <Option value="MONEY_FULL_SPONSOR">
                        Tài trợ toàn phần
                      </Option>
                      <Option value="MONEY_PARTIAL_SPONSOR">
                        Tài trợ một phần
                      </Option>
                      <Option value="GIFT_SPONSOR">Tài trợ quà tặng</Option>
                      <Option value="BOOTH_SPONSOR">Tài trợ gian hàng</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Mô tả"
                    name={[name, "sponsorDescription"]}
                    fieldKey={[fieldKey, "sponsorDescription"]}
                    rules={[
                      { required: true, message: "Please enter a description" },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Số tiền tài trợ"
                    name={[name, "moneySponsorAmount"]}
                    fieldKey={[fieldKey, "moneySponsorAmount"]}
                    rules={[
                      {
                        validator: validateAmount,
                      },
                    ]}
                  >
                    <Input addonBefore="VNĐ" />
                  </Form.Item>

                  <Form.Item
                    label="Nhà tài trợ"
                    name={[name, "sponsorId"]}
                    fieldKey={[fieldKey, "sponsorId"]}
                    rules={[
                      { required: true, message: "Please select a sponsor" },
                    ]}
                  >
                    <Select placeholder="Chọn nhà tài trợ">
                      {sponsors.map((sponsor) => (
                        <Option key={sponsor.id} value={sponsor.id}>
                          {sponsor.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Button type="danger" onClick={() => remove(name)}>
                    Xóa
                  </Button>
                </Space>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Thêm dòng mới
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm kinh phí tài trợ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddSponsorMoney;
