import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getAllSponsors } from "../../api/sponsorApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import AddSponsorMoney from "../Sponsor/AddSponsorMoney";
import SponsorHistory from "./SponsorHistory";
const SponsorModal = () => {
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { eventId } = useParams();
  const [showAddSponsor, setShowAddSponsor] = useState(false);

  useEffect(() => {
    fetchSponsorsData();
  }, []);

  const handleSponsorAdded = () => {
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
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (isLoading) {
    return <LoadingComponent isLoading={true} />;
  }

  return (
    <div className="container mx-auto py-12">
      {/* <div className="pl-4 mt-8">
        <h3 className="text-3xl font-bold mb-6">
          Thêm tiền tài trợ vào sự kiện
        </h3>
        <AddSponsorMoney
          eventId={eventId}
          onSponsorAdded={handleSponsorAdded}
        />
      </div> */}
      <h3 className="text-3xl font-bold mb-6">Nhà tài trợ</h3>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={() => setShowAddSponsor(!showAddSponsor)}
      >
        Thêm tiền tài trợ vào sự kiện
      </button>
      {showAddSponsor && (
        <div className="mt-4">
          <AddSponsorMoney
            eventId={eventId}
            onSponsorAdded={handleSponsorAdded}
          />
        </div>
      )}
      <div className="mt-8">
        <h3 className="text-3xl font-bold mb-6">
          Lịch sử giao dịch tài trợ theo sự kiện
        </h3>
        <SponsorHistory />
      </div>
      <h3 className="text-3xl font-bold mb-6">Đơn vị tài trợ</h3>

      {/* <Slider {...settings}>
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="px-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
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
          </div>
        ))}
      </Slider> */}
    </div>
  );
};

export default SponsorModal;
