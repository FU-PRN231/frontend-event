import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { getAllEvent } from "../../api/eventApi";
import { addSponsorMoneyToEvent, getAllSponsors } from "../../api/sponsorApi";

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
          sponsorType: "", // Initialize sponsorType as empty string or default value
          sponsorDescription: "",
          moneySponsorAmount: "",
          sponsorId: "",
        },
      ],
    },
  });

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

  const { fields, append } = useFieldArray({
    control,
    name: "sponsorItems",
  });

  const onSubmit = async (data) => {
    try {
      // Convert sponsorType to integer based on SponsorType enumeration
      data.sponsorItems.forEach((item) => {
        item.sponsorType = SponsorType[item.sponsorType];
      });

      const response = await addSponsorMoneyToEvent(
        selectedEventId,
        data.sponsorItems
      );

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

  const validateAmount = (value) => {
    if (!value) {
      return "Money Sponsor Amount is required";
    }
    const regex = /^[0-9]*$/;
    if (!regex.test(value)) {
      return "Please enter a valid number";
    }
    if (parseInt(value) <= 0) {
      return "Amount must be greater than 0";
    }
    return true;
  };

  const handleEventChange = (e) => {
    const selectedId = e.target.value;
    setSelectedEventId(selectedId);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Kinh phí hỗ trợ sự kiện</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="event"
              >
                Sự kiện
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="event"
                name="event"
                value={selectedEventId}
                onChange={handleEventChange}
              >
                <option value="">Chọn sự kiện</option>
                {events &&
                  events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hình thức tài trợ:
              </label>
              <select
                {...register(`sponsorItems.${index}.sponsorType`, {
                  required: "Sponsor Type is required",
                })}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.sponsorItems?.[index]?.sponsorType
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Chọn loại tài trợ</option>
                <option value={SponsorType.MONEY_FULL_SPONSOR}>
                  Tài trợ toàn phần
                </option>
                <option value={SponsorType.MONEY_PARTIAL_SPONSOR}>
                  Tài trợ một phần
                </option>
                <option value={SponsorType.GIFT_SPONSOR}>
                  Tài trợ quà tặng
                </option>
                <option value={SponsorType.BOOTH_SPONSOR}>
                  Tài trợ gian hàng
                </option>
              </select>
              {errors.sponsorItems?.[index]?.sponsorType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sponsorItems[index].sponsorType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mô tả:
              </label>
              <input
                type="text"
                {...register(`sponsorItems.${index}.sponsorDescription`, {
                  required: "Sponsor Description is required",
                })}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
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
                Số tiền tài trợ:
              </label>
              <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
                <span className="inline-flex items-center px-3 border-r border-gray-300">
                  VNĐ
                </span>
                <input
                  type="text"
                  {...register(`sponsorItems.${index}.moneySponsorAmount`, {
                    validate: validateAmount,
                  })}
                  className={`flex-1 appearance-none block w-full px-3 py-2 border-0 rounded-none focus:outline-none focus:ring-0 focus:border-0 sm:text-sm ${
                    errors.sponsorItems?.[index]?.moneySponsorAmount
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>
              {errors.sponsorItems?.[index]?.moneySponsorAmount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sponsorItems[index].moneySponsorAmount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nhà tài trợ:
              </label>
              <select
                {...register(`sponsorItems.${index}.sponsorId`, {
                  required: "Sponsor ID is required",
                })}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.sponsorItems?.[index]?.sponsorId
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Chọn nhà tài trợ</option>
                {sponsors &&
                  sponsors.map((sponsor) => (
                    <option key={sponsor.id} value={sponsor.id}>
                      {sponsor.name}
                    </option>
                  ))}
              </select>
              {errors.sponsorItems?.[index]?.sponsorId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sponsorItems[index].sponsorId.message}
                </p>
              )}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Tạo
        </button>
      </form>
    </div>
  );
};

export default AddSponsorMoney;
