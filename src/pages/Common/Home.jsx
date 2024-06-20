import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import QrReader from "react-qr-scanner";
import { useEffect, useState } from "react";
import { getAllAvailableEvent, getAllEvent } from "../../api/eventApi";
import {
  addAttendee,
  decodeQrCode,
  generateAccountQrCode,
  getAllAttendeesByEventId,
} from "../../api/checkinApi";
import { getAllEvent } from "../../api/eventApi";

const CheckInModal = () => {
  const [checkInResult, setCheckInResult] = useState(null);
  const { handleSubmit, setValue } = useForm();
  const [selectedEventId, setSelectedEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);

  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchAttendees = async (eventId) => {
    try {
      const attendeesData = await getAllAttendeesByEventId(eventId);
      setAttendees(attendeesData.result.items);
    } catch (error) {
      console.error("Error fetching attendees:", error);

  const fetchData = async () => {
    const res = await getAllAvailableEvent(1, 10);
    if (res.isSuccess) {
      setEvents(res.result.items);
      const initialCountdowns = {};
      res.result.items.forEach((event, index) => {
        initialCountdowns[index] = calculateCountdown(event.eventDate);
      });
      setCountdowns(initialCountdowns);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendees(selectedEventId);
    }
  }, [selectedEventId]);

  const getAccountIdByName = async (name) => {
    // Simulated function to get accountId by name. Replace with actual implementation.
    // This is just a placeholder, as the original request did not include this part.
    return "06e8f582-cce4-4866-90e2-e3a3cfd3edd3"; // Example accountId
  };

  const manageCheckInByQr = async (accountId) => {
    try {
      const qrCodeResponse = await generateAccountQrCode(accountId);

      if (!qrCodeResponse.isSuccess) {
        throw new Error(qrCodeResponse.messages.join(", "));
      }

      const qrString = qrCodeResponse.result;

      const decodeResponse = await decodeQrCode(qrString);

      if (!decodeResponse.isSuccess) {
        throw new Error(decodeResponse.messages.join(", "));
      }

      const attendeeResponse = await addAttendee(accountId, selectedEventId);

      if (!attendeeResponse.isSuccess) {
        throw new Error(attendeeResponse.messages.join(", "));
      }

      // Refresh attendees list
      fetchAttendees(selectedEventId);

      return {
        isSuccess: true,
        decodedData: decodeResponse.result,
      };
    } catch (error) {
      console.error("Check-in process failed:", error);
      return {
        isSuccess: false,
        message:
          error.message || "An error occurred during the check-in process.",
      };
    }
  };

  const onSubmit = async (data) => {
    try {
      const accountId = await getAccountIdByName(data.name);

      const result = await manageCheckInByQr(accountId);
      setCheckInResult(result);
    } catch (error) {
      console.error("Error fetching accountId or performing check-in:", error);
      setCheckInResult({
        isSuccess: false,
        message: "Failed to perform check-in. Please try again.",
      });
    }
  };

  const handleScan = async (data) => {
    if (data) {
      setValue("name", data.text);
      try {
        const accountId = await getAccountIdByName(data.text);

        const result = await manageCheckInByQr(accountId);
        setCheckInResult(result);
      } catch (error) {
        console.error(
          "Error fetching accountId or performing check-in:",
          error
        );
        setCheckInResult({
          isSuccess: false,
          message: "Failed to perform check-in. Please try again.",
        });
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="container grid grid-cols-2 gap-4">
      <div className="mt-10 w-full">
        <h1 className="text-primary font-bold uppercase text-center text-md my-2">
          Check in automatically with Cóc Event
        </h1>
        <div className="p-4 rounded-md shadow-xl">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%" }}
            facingMode="environment"
          />
        </div>
      </div>
      <div className="mt-8 rounded-lg p-4 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="event"
            name="event"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">Chọn Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="Enter Name"
            className="w-full p-2 border rounded mt-4"
          />
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Check In
          </button>
        </form>
        {checkInResult && (
          <div className="mt-4">
            {checkInResult.isSuccess ? (
              <p className="text-green-500">
                Check-in successful: {checkInResult.decodedData}
              </p>
            ) : (
              <p className="text-red-500">
                Check-in failed: {checkInResult.message}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="mt-8 rounded-lg p-4 shadow-lg col-span-2">
        <h2 className="text-primary font-bold uppercase text-center text-md my-2">
          Attendees for Selected Event
        </h2>
        {attendees.length > 0 ? (
          <ul className="list-disc list-inside">
            {attendees.map((attendee) => (
              <li key={attendee.id}>{attendee.name}</li>
            ))}
          </ul>
        ) : (
          <p>No attendees found for this event.</p>
        )}
      </div>
    </div>
  );
};

export default CheckInModal;
