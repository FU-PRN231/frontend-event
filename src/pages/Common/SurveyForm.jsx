import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";
import { addAnswerToSurvey } from "../../api/surveyApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const SurveyForm = ({ surveyId, accountId }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      answerDetails: [
        { textAnswer: "", rating: "", surveyQuestionDetailId: "" },
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

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    const answerDetails = data.answerDetails.map((detail) => ({
      ...detail,
      SurveyQuestionDetailId: detail.surveyQuestionDetailId,
    }));

    const answerData = {
      accountId,
      surveyId,
      answerDetails,
    };

    try {
      const response = await addAnswerToSurvey(answerData);
      if (response.isSuccess) {
        setSuccess(true);
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-start space-x-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Câu trả lời {index + 1}
                <Controller
                  name={`answerDetails.${index}.textAnswer`}
                  control={control}
                  rules={{ required: "Câu trả lời là bắt buộc" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  )}
                />
                {errors.answerDetails?.[index]?.textAnswer && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.answerDetails[index].textAnswer.message}
                  </p>
                )}
              </label>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Đánh giá
                <Controller
                  name={`answerDetails.${index}.rating`}
                  control={control}
                  rules={{
                    min: { value: 0, message: "Đánh giá phải ít nhất là 0" },
                    max: { value: 5, message: "Đánh giá phải tối đa là 5" },
                  }}
                  render={({ field }) => (
                    <ReactStars
                      {...field}
                      count={5}
                      onChange={(newValue) => field.onChange(newValue)}
                      size={24}
                      activeColor="#ffd700"
                      value={field.value}
                    />
                  )}
                />
                {errors.answerDetails?.[index]?.rating && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.answerDetails[index].rating.message}
                  </p>
                )}
              </label>
            </div>
            <Controller
              name={`answerDetails.${index}.surveyQuestionDetailId`}
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-6 text-red-600 hover:text-red-800"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() =>
              append({ textAnswer: "", rating: 0, surveyQuestionDetailId: "" })
            }
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Thêm câu trả lời
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {loading ? <LoadingComponent /> : "Gửi"}
          </button>
        </div>
      </form>
      {success && (
        <p className="mt-4 text-green-600">Gửi khảo sát thành công!</p>
      )}
      {error && <p className="mt-4 text-red-600">Lỗi: {error}</p>}
    </div>
  );
};

export default SurveyForm;
