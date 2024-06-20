import React, { useCallback, useEffect, useState } from "react";
import { getAllEvent } from "../../api/eventApi";
import { getSponsorHistoryByEventId } from "../../api/sponsorApi";

const SponsorHistory = ({ eventId }) => {
  const [sponsorHistory, setSponsorHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [events, setEvents] = useState([]);

  const fetchSponsorHistory = useCallback(async () => {
    if (!selectedEventId) return; // No need to fetch if no event selected

    setLoading(true);
    try {
      const response = await getSponsorHistoryByEventId(selectedEventId, 1, 10);
      setSponsorHistory(response.result.items); // Assuming response.result.items is an array
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sponsor history:", error);
      setError("Error fetching sponsor history");
      setLoading(false);
    }
  }, [selectedEventId]);

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

  const handleEventChange = (e) => {
    const selectedId = e.target.value;
    setSelectedEventId(selectedId);
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchSponsorHistory();
    } else {
      setSponsorHistory([]);
    }
  }, [selectedEventId, fetchSponsorHistory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Sponsor History</h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="event"
        >
          Select Event
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="event"
          name="event"
          value={selectedEventId}
          onChange={handleEventChange}
        >
          <option value="">Select Event</option>
          {events &&
            events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
        </select>
      </div>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {sponsorHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sponsor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sponsor Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From Sponsor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sponsorHistory.map((sponsor) => (
                <tr key={sponsor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {sponsor.event && sponsor.event.title
                        ? sponsor.event.title
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {sponsor.event && sponsor.event.description
                        ? sponsor.event.description
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {sponsor.event && sponsor.event.eventDate
                        ? new Date(sponsor.event.eventDate).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {sponsor.eventSponsor &&
                      sponsor.eventSponsor.sponsor &&
                      sponsor.eventSponsor.sponsor.name
                        ? sponsor.eventSponsor.sponsor.name
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {sponsor.eventSponsor && sponsor.eventSponsor.sponsorType
                        ? sponsor.eventSponsor.sponsorType
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      ${sponsor.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {sponsor.isFromSponsor ? "Yes" : "No"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No sponsor history found.
        </p>
      )}
    </div>
  );
};

export default SponsorHistory;
