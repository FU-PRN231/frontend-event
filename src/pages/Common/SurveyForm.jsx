import { Button, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";
import { getEventById } from "../../api/eventApi";
import { addAnswerToSurvey, getAllSurveys } from "../../api/surveyApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const { Option } = Select;

const SurveyForm = ({ accountId }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      surveyId: "",
      answerDetails: [
        { textAnswer: "", rating: 0, surveyQuestionDetailId: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answerDetails",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState("");

  useEffect(() => {
    const fetchSurveysWithEvents = async () => {
      try {
        const surveyData = await getAllSurveys();
        const surveysWithEvents = await Promise.all(
          surveyData.result.map(async (survey) => {
            const event = await getEventById(survey.survey.eventId);
            return {
              ...survey.survey,
              eventTitle: event?.title || "N/A",
            };
          })
        );
        setSurveys(surveysWithEvents);
      } catch (error) {
        console.error("Error fetching surveys or events:", error);
      }
    };

    fetchSurveysWithEvents();
  }, []);

  const handleSurveyChange = (value) => {
    setSelectedSurveyId(value);
    reset({
      surveyId: value,
      answerDetails: [
        { textAnswer: "", rating: 0, surveyQuestionDetailId: "" },
      ],
    });
    setSuccess(false);
    setError(null);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    const answerDetails = data.answerDetails.map((detail) => ({
      ...detail,
      surveyQuestionDetailId: detail.surveyQuestionDetailId || "",
    }));

    const answerData = {
      accountId,
      surveyId: selectedSurveyId,
      answerDetails,
    };

    try {
      const response = await addAnswerToSurvey(answerData);
      if (response.isSuccess) {
        setSuccess(true);
        reset({
          surveyId: selectedSurveyId,
          answerDetails: [
            { textAnswer: "", rating: 0, surveyQuestionDetailId: "" },
          ],
        });
      } else {
        setError(response.messages.join(", "));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <Form onFinish={handleSubmit(onSubmit)} className="space-y-6">
        <Form.Item
          label="Chọn khảo sát"
          validateStatus={errors.surveyId ? "error" : ""}
          help={errors.surveyId && errors.surveyId.message}
        >
          <Controller
            name="surveyId"
            control={control}
            rules={{ required: "Vui lòng chọn khảo sát" }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Chọn khảo sát"
                className="w-full"
                onChange={(value) => {
                  field.onChange(value);
                  handleSurveyChange(value);
                }}
                value={selectedSurveyId}
                disabled={loading || surveys?.length === 0}
              >
                {surveys?.map((survey) => (
                  <Option key={survey.id} value={survey.id}>
                    {survey.name} (Event: {survey.eventTitle})
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors.surveyId && (
            <p className="text-red-500 text-xs italic">
              {errors.surveyId.message}
            </p>
          )}
        </Form.Item>

        {fields.map((item, index) => (
          <div key={item.id} className="flex items-start space-x-6">
            <div className="flex-1">
              <Form.Item
                label={`Câu trả lời ${index + 1}`}
                validateStatus={
                  errors.answerDetails?.[index]?.textAnswer ? "error" : ""
                }
                help={
                  errors.answerDetails?.[index]?.textAnswer &&
                  errors.answerDetails[index].textAnswer.message
                }
              >
                <Controller
                  name={`answerDetails.${index}.textAnswer`}
                  control={control}
                  rules={{ required: "Câu trả lời là bắt buộc" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Nhập câu trả lời"
                    />
                  )}
                />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Đánh giá"
                validateStatus={
                  errors.answerDetails?.[index]?.rating ? "error" : ""
                }
                help={
                  errors.answerDetails?.[index]?.rating &&
                  errors.answerDetails[index].rating.message
                }
              >
                <Controller
                  name={`answerDetails.${index}.rating`}
                  control={control}
                  rules={{
                    min: { value: 0, message: "Đánh giá phải ít nhất là 0" },
                    max: { value: 5, message: "Đánh giá phải tối đa là 5" },
                  }}
                  render={({ field }) => (
                    <ReactStars
                      count={5}
                      onChange={(newValue) => field.onChange(newValue)}
                      size={24}
                      activeColor="#ffd700"
                      value={field.value}
                    />
                  )}
                />
              </Form.Item>
            </div>
            <Controller
              name={`answerDetails.${index}.surveyQuestionDetailId`}
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <Button
              type="button"
              onClick={() => remove(index)}
              className="mt-6 text-red-600 hover:text-red-800"
              icon={<FaTrash />}
            />
          </div>
        ))}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {loading ? <LoadingComponent /> : "Gửi"}
          </Button>
        </div>
      </Form>
      {success && (
        <p className="mt-4 text-green-600">Gửi khảo sát thành công!</p>
      )}
      {error && <p className="mt-4 text-red-600">Lỗi: {error}</p>}
    </div>
  );
};

export default SurveyForm;
