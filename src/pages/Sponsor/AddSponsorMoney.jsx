import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { addSponsorMoneyToEvent } from "../../api/sponsorApi";

const AddSponsorMoney = ({ eventId, onSponsorAdded }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sponsorItems: [
        {
          sponsorType: 0,
          sponsorDescription: "",
          moneySponsorAmount: 0,
          sponsorId: "",
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "sponsorItems",
  });

  const onSubmit = async (data) => {
    try {
      const response = await addSponsorMoneyToEvent(eventId, data.sponsorItems);
      if (response.isSuccess) {
        onSponsorAdded();
        reset();
      } else {
        console.error(response.messages.join(", "));
      }
    } catch (error) {
      console.error("Error adding sponsor money:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Sponsor Money to Event</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sponsor Type:
              </label>
              <input
                type="number"
                {...register(`sponsorItems.${index}.sponsorType`, {
                  required: "Sponsor Type is required",
                })}
                className={`mt-1 block w-full border ${
                  errors.sponsorItems?.[index]?.sponsorType
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.sponsorItems?.[index]?.sponsorType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sponsorItems[index].sponsorType.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sponsor Description:
              </label>
              <input
                type="text"
                {...register(`sponsorItems.${index}.sponsorDescription`, {
                  required: "Sponsor Description is required",
                })}
                className={`mt-1 block w-full border ${
                  errors.sponsorItems?.[index]?.sponsorDescription
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.sponsorItems?.[index]?.sponsorDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sponsorItems[index].sponsorDescription.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Money Sponsor Amount:
              </label>
              <input
                type="number"
                {...register(`sponsorItems.${index}.moneySponsorAmount`, {
                  required: "Money Sponsor Amount is required",
                  min: {
                    value: 1,
                    message: "Amount must be greater than 0",
                  },
                })}
                className={`mt-1 block w-full border ${
                  errors.sponsorItems?.[index]?.moneySponsorAmount
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.sponsorItems?.[index]?.moneySponsorAmount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sponsorItems[index].moneySponsorAmount.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sponsor ID:
              </label>
              <input
                type="text"
                {...register(`sponsorItems.${index}.sponsorId`, {
                  required: "Sponsor ID is required",
                })}
                className={`mt-1 block w-full border ${
                  errors.sponsorItems?.[index]?.sponsorId
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.sponsorItems?.[index]?.sponsorId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sponsorItems[index].sponsorId.message}
                </p>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            append({
              sponsorType: 0,
              sponsorDescription: "",
              moneySponsorAmount: 0,
              sponsorId: "",
            })
          }
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Another Sponsor Item
        </button>
        <button
          type="submit"
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddSponsorMoney;
