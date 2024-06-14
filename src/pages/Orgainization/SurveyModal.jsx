import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getAllSurveys } from "../../api/surveyApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const SurveyModal = () => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await getAllSurveys();
        setSurveys(data.result || []); // Assuming the data structure
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveys();
  }, []);

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
      <h3 className="text-3xl font-bold mb-6">Surveys</h3>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <div className="grid grid-cols-1 gap-4">
            {surveys.map((survey) => (
              <div
                key={survey.survey.id}
                className="border p-4 rounded-lg shadow-lg"
              >
                <h4 className="text-xl font-bold">{survey.survey.name}</h4>
                <p className="text-sm">Created by: {survey.survey.createBy}</p>
                <p className="text-sm">Event ID: {survey.survey.eventId}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-4">
          <h3 className="text-3xl font-bold mb-6">Additional Content</h3>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
