import React, { useEffect, useState } from "react";
import { Calendar, Clock, Info, User } from "react-feather";
import { getAccountById, getAllAccount } from "../../api/accountApi";
import { getAllEvent } from "../../api/eventApi";
import { getAllOrganizations } from "../../api/organizationApi";
import { getAllSurveys } from "../../api/surveyApi";

const SurveyModal = () => {
  const [surveys, setSurveys] = useState([]);
  const [accountDetails, setAccountDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    fetchSurveys();
    fetchEvents();
    fetchOrganizations();
  }, []);

  const fetchSurveys = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSurveys();
      if (data.isSuccess) {
        const surveysData = data.result || [];

        // Fetch account details for creators
        const creatorIds = surveysData.map((survey) => survey.survey.createBy);
        const uniqueCreatorIds = [...new Set(creatorIds)]; // Lấy danh sách các ID người tạo duy nhất
        const accountsPromises = uniqueCreatorIds.map((id) =>
          getAccountById(id)
        );
        const accountsData = await Promise.all(accountsPromises);

        // Tạo một bản đồ chi tiết tài khoản
        const accountDetailsMap = {};
        accountsData.forEach((account) => {
          accountDetailsMap[account.id] = account;
        });

        // Cập nhật state với dữ liệu đã lấy được
        setAccountDetails(accountDetailsMap);
        setSurveys(surveysData);
      } else {
        console.error("Lỗi khi lấy danh sách khảo sát:", data.messages);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khảo sát:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items); // Cập nhật trạng thái sự kiện với các mục đã lấy được
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sự kiện:", error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await getAllOrganizations(1, 10);
      if (res.isSuccess) {
        const organizationsData = res.result.items || [];
        setOrganizations(organizationsData);
      } else {
        console.error("Phản hồi không thành công:", res.messages);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tổ chức:", error);
    }
  };

  const getAllAccountById = async (accountId) => {
    try {
      const accountData = await getAllAccount(accountId);
      return accountData;
    } catch (error) {
      console.error("Lỗi khi lấy tài khoản theo ID:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // Xử lý ngày tháng rỗng hoặc null một cách dễ dàng
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error(`Chuỗi ngày không hợp lệ: ${dateString}`);
      return ""; // Xử lý các chuỗi ngày không hợp lệ
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getEventTitle = (eventId) => {
    const event = events.find((event) => event.id === eventId);
    return event ? event.title : ""; // Trả về tiêu đề sự kiện nếu tìm thấy, ngược lại trả về chuỗi rỗng
  };

  const getAccountName = (accountId) => {
    return accountDetails[accountId]?.name || "";
  };

  const SurveyItemDetail = ({ icon, label, value }) => (
    <div className="mb-2">
      <p className="text-sm text-gray-600 flex items-center">
        {icon} <span className="ml-1">{label}</span> {value}
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {surveys.map((item) => (
        <div
          key={item.survey.id}
          className="border rounded-lg shadow-md p-6 flex items-start"
        >
          <div className="mr-4 flex-shrink-0">
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <Info className="mr-2" /> {item.survey.name}
            </h3>
            <div>
              <SurveyItemDetail
                icon={<Info className="w-4 h-4 mr-1" />}
                label="Sự kiện:"
                value={getEventTitle(item.survey.eventId)}
              />
              <SurveyItemDetail
                icon={<Clock className="w-4 h-4 mr-1" />}
                label="Ngày bắt đầu sự kiện:"
                value={formatDate(item.startEventDate)}
              />
              <SurveyItemDetail
                icon={<Clock className="w-4 h-4 mr-1" />}
                label="Ngày kết thúc sự kiện:"
                value={formatDate(item.endEventDate)}
              />
              <SurveyItemDetail
                icon={<User className="w-4 h-4 mr-1" />}
                label="Người tạo:"
                value={getAccountName(item.survey.createBy)}
              />
              <SurveyItemDetail
                icon={<Calendar className="w-4 h-4 mr-1" />}
                label="Ngày tạo:"
                value={formatDate(item.survey.createDate)}
              />
              <SurveyItemDetail
                icon={<Calendar className="w-4 h-4 mr-1" />}
                label="Ngày cập nhật:"
                value={formatDate(item.survey.updateDate)}
              />
              <SurveyItemDetail
                icon={<Info className="w-4 h-4 mr-1" />}
                label="Mô tả:"
                value={item.survey.description}
              />
              <SurveyItemDetail
                icon={<Info className="w-4 h-4 mr-1" />}
                label="Thông tin bổ sung:"
                value={item.additionalInfo}
              />
              {item.surveyQuestionDetails.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-bold mb-2">Câu hỏi khảo sát</h4>
                  {item.surveyQuestionDetails.map((question) => (
                    <div key={question.id} className="mb-2">
                      <p className="text-sm font-semibold">
                        {question.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        Loại:{" "}
                        {question.answerType === 0 ? "Văn bản" : "Đánh giá"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Xem chi tiết
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SurveyModal;
