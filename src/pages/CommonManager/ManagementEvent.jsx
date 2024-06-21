import { useEffect, useState } from "react";
import { getAllEvent } from "../../api/eventApi";
import EventTable from "../Common/Event/EventTable";
import { NavLink } from "react-router-dom";

const MangementEvent = () => {
  const [events, setEvents] = useState([]);
  const fetchData = async () => {
    const res = await getAllEvent(1, 10);
    if (res.isSuccess) {
      setEvents(res.result.items);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <h1 className="text-center text-primary font-bold text-xl">
        QUẢN LÝ SỰ KIỆN
      </h1>
      <div className="flex justify-end my-10">
        <NavLink className="btn" to={`create-event`}>
          Thêm sự kiện
        </NavLink>
      </div>
      <EventTable events={events} />
    </div>
  );
};
export default MangementEvent;
