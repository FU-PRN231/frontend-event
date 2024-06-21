import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getAllSponsors } from "../../api/sponsorApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import AddSponsorForm from "./AddSponsorForm";

const SponsorModal = () => {
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { eventId } = useParams();

  useEffect(() => {
    fetchSponsorsData();
  }, []);

  const handleSponsorAdded = () => {
    // Refresh sponsors data after adding a new sponsor
    fetchSponsorsData();
  };

  const fetchSponsorsData = async () => {
    try {
      const data = await getAllSponsors();
      setSponsors(data.result.items);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      setIsLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (isLoading) {
    return <LoadingComponent isLoading={true} />;
  }

  return (
    <div className="container mx-auto py-12">
      <h3 className="text-3xl font-bold mb-6">Nhà tài trợ</h3>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <div className="grid grid-cols-1 gap-4">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <img
                  src={sponsor.img}
                  alt={sponsor.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h4 className="text-xl font-bold">{sponsor.name}</h4>
                  <p className="mt-2">{sponsor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-4">
          <h3 className="text-3xl font-bold mb-6">Thêm nhà tài trợ</h3>
          <AddSponsorForm
            eventId={eventId}
            onSponsorAdded={handleSponsorAdded}
          />
        </div>
      </div>
    </div>
  );
};

export default SponsorModal;
