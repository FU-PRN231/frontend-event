import React, { useEffect, useState } from "react";
import { getSponsorHistoryByEventId } from "../../api/sponsorApi";

const SponsorHistory = ({ eventId }) => {
  const [sponsorHistory, setSponsorHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSponsorHistory = async () => {
      try {
        setLoading(true);
        const response = await getSponsorHistoryByEventId(eventId, 1, 10);
        setSponsorHistory(response.result.items);
        setLoading(false);
      } catch (error) {
        setError("Error fetching sponsor history");
        setLoading(false);
        console.error("Error fetching sponsor history:", error);
      }
    };

    fetchSponsorHistory();
  }, [eventId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Sponsor History</h2>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-error-color">{error}</p>}

      {sponsorHistory.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {sponsorHistory.map((sponsor) => (
            <li key={sponsor.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="text-lg font-semibold">{sponsor.event.title}</p>
                  <p className="text-sm text-gray-500">
                    {sponsor.event.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Event Date:{" "}
                    {new Date(sponsor.event.eventDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold">
                    {sponsor.eventSponsor.sponsor.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Sponsor Type: {sponsor.eventSponsor.sponsorType}
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: ${sponsor.amount} | From Sponsor:{" "}
                    {sponsor.isFromSponsor ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {sponsorHistory.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-4">
          No sponsor history found.
        </p>
      )}
    </div>
  );
};

export default SponsorHistory;
