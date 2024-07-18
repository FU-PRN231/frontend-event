import { useEffect, useState } from "react";
import { getAllEvent, getEventByOrganizerId } from "../../api/eventApi";
import EventTable from "../Common/Event/EventTable";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const MangementEvent = () => {
  const role = useSelector((state) => state.user.role || "");
  const user = useSelector((state)=> state.user.user || {})
  const [events, setEvents] = useState([]);
  const fetchData = async () => {
    const res = await getEventByOrganizerId(user.organizationId,1, 10);
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
        {role === "ORGANIZER" && (
          <NavLink className="btn bg-primary text-white" to={`create-event`}>
            Thêm sự kiện
          </NavLink>
        )}
      </div>
      <EventTable events={events} />
    </div>
  );
};
export default MangementEvent;
