import { useEffect, useState } from "react";
import { getEventById } from "../../../api/eventApi";
import {
  calculateCountdown,
  formatDate,
  formatDateTime,
  formatPrice,
} from "../../../utils/util";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";

const EventDetail = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [countdown, setCountdown] = useState("");

  const fetchData = async () => {
    const res = await getEventById(id);
    if (res.isSuccess) {
      setEventData(res.result);
      setCountdown(calculateCountdown(res.result.event?.eventDate));
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (eventData) {
      const interval = setInterval(() => {
        setCountdown(calculateCountdown(eventData.event?.eventDate));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [eventData]);

  if (!eventData) {
    return <LoadingComponent isLoading={true} />;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "#0c4a6e" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "#0c4a6e" }}
        onClick={onClick}
      />
    );
  }

  const primaryColor = "#0c4a6e";
  const secondaryColor = "#e63946";

  const titleFontSize = "text-3xl";
  const subtitleFontSize = "text-xl";
  const textFontSize = "text-base";
  const sectionMargin = "mt-12";
  const titleMargin = "mb-6";
  const cardPadding = "p-6";
  const settingsSpeaker = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  return (
    <div className={`container mx-auto py-12 ${sectionMargin}`}>
      <h2
        className={`text-4xl font-bold ${titleMargin} text-center text-${primaryColor} py-4 rounded-lg`}
      >
        {eventData.event?.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`bg-white rounded-lg overflow-hidden ${cardPadding}`}>
          <h4
            className={`${titleFontSize} font-bold text-${primaryColor} mb-4`}
          >
            Hình ảnh sự kiện
          </h4>
          <Slider {...settings}>
            {eventData.staticFiles?.map((file, index) => (
              <div key={index}>
                <img
                  src={file.img}
                  alt="Event"
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div
          className={`bg-white rounded-lg shadow-md overflow-hidden ${cardPadding}`}
        >
          <div className={cardPadding}>
            <h4
              className={`${titleFontSize} font-bold text-${primaryColor} mb-4 text-center`}
            >
              Thông tin về sự kiện
            </h4>
            <h4
              className={`${subtitleFontSize} font-bold text-${primaryColor} mb-4`}
            >
              {eventData.event?.title}
            </h4>
            <p className="text-gray-600 mb-6">{eventData.event?.description}</p>
            <div className="flex items-center mb-4">
              <i
                className={`fas fa-calendar-alt text-${primaryColor} mr-2`}
              ></i>
              <span className="text-gray-600">
                {formatDate(eventData.event?.eventDate)}
              </span>
            </div>
            <div className="flex items-center mb-4">
              <i className={`fas fa-clock text-${primaryColor} mr-2`}></i>
              <span className="text-gray-600">
                {formatDateTime(eventData.event?.startTime)} -{" "}
                {formatDateTime(eventData.event?.endTime)}
              </span>
            </div>
            <div className="flex items-center mb-4">
              <i
                className={`fas fa-map-marker-alt text-${primaryColor} mr-2`}
              ></i>
              <span className="text-gray-600">
                {eventData.event?.location.name},{" "}
                {eventData.event?.location.address}
              </span>
            </div>
            <div className="flex items-center">
              <i className={`fas fa-building text-${primaryColor} mr-2`}></i>
              <span className="text-gray-600">
                {eventData.event?.organization.name}
              </span>
            </div>
          </div>
          <div className={`text-${primaryColor} ${cardPadding}`}>
            <p className={`${subtitleFontSize} font-semibold`}>
              Thời gian còn lại: {countdown}
            </p>
          </div>
        </div>
      </div>
      <div className={sectionMargin}>
        <h3 className={`${titleFontSize} font-bold ${titleMargin}`}>Hạng vé</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventData.seatRanks?.map((seatRank) => (
            <div
              key={seatRank.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${cardPadding} flex flex-col justify-between`}
            >
              <div className={cardPadding}>
                <h4 className={`${subtitleFontSize} font-bold mb-2`}>
                  {seatRank.name}
                </h4>
                <p className="text-gray-600 mb-2">{seatRank.description}</p>
                <p className="text-gray-600 mb-2">
                  Giá: {formatPrice(seatRank.price)}
                </p>
                <p className="text-gray-600 mb-2">
                  Số vé còn lại: {seatRank.remainingCapacity}
                </p>
                <p className="text-gray-600 mb-2">
                  Start Time: {formatDateTime(seatRank.startTime)}
                </p>
                <p className="text-gray-600">
                  End Time: {formatDateTime(seatRank.endTime)}
                </p>
              </div>
              <div
                className={`text-center p-4 bg-${primaryColor} text-white rounded-lg cursor-pointer hover:bg-${secondaryColor}`}
              >
                <p className={`${subtitleFontSize} font-semibold`}>Book Now</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={sectionMargin}>
        <h3 className={`${titleFontSize} font-bold ${titleMargin}`}>
          Diễn giả
        </h3>
        <Slider {...settingsSpeaker}>
          {eventData.speakers?.map((speaker) => (
            <div
              key={speaker.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${cardPadding}`}
            >
              <img
                src={speaker.img}
                alt={speaker.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className={cardPadding}>
                <h4 className={`${subtitleFontSize} font-bold mb-2`}>
                  {speaker.name}
                </h4>
                <p className="text-gray-600">{speaker.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className={sectionMargin}>
        <h3 className={`${titleFontSize} font-bold ${titleMargin}`}>
          Nhà tài trợ
        </h3>
        <Slider {...settings}>
          {eventData.eventSponsors?.map((sponsor) => (
            <div
              key={sponsor.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${cardPadding}`}
            >
              <img
                src={sponsor.sponsor.img}
                alt={sponsor.sponsor.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className={cardPadding}>
                <h4 className={`${subtitleFontSize} font-bold mb-2`}>
                  {sponsor.sponsor.name}
                </h4>
                <p className="text-gray-600">{sponsor.sponsorDescription}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className={sectionMargin}>
        <h3 className={`${titleFontSize} font-bold ${titleMargin}`}>
          Bài viết
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventData.posts?.map((post) => (
            <div
              key={post.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${cardPadding}`}
            >
              <div className={cardPadding}>
                <h4 className={`${subtitleFontSize} font-bold mb-2`}>
                  {post.title}
                </h4>
                <p className="text-gray-600">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
