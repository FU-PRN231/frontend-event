import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getAllSponsors } from "../../api/sponsorApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import AddSponsorForm from "./AddSponsorForm";
import SponsorHistory from "./SponsorHistory";

const SponsorModal = () => {
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { eventId } = useParams();

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
      <div className="w-1/2 pl-4">
        <h3 className="text-3xl font-bold mb-6">Đơn vị tài trợ cho sự kiện </h3>
        <AddSponsorForm eventId={eventId} onSponsorAdded={handleSponsorAdded} />
      </div>
      <div className="mt-8">
        <h3 className="text-3xl font-bold mb-6">
          Lịch Sử Giao Dịch Của Nhà Tài Trợ Theo Sự Kiện
        </h3>
        <SponsorHistory />
      </div>
      <h3 className="text-3xl font-bold mb-6">Nhà tài trợ</h3>

      <Slider {...settings}>
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
      </Slider>
    </div>
  );
};

export default SponsorModal;
