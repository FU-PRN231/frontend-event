import { NavLink } from "react-router-dom";
import { formatDate, formatDateTime } from "../../../utils/util";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";

const EventTable = ({ events }) => {
  const role = useSelector((state) => state.user.role || "");

  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="table">
          <thead className="h-16 bg-primary text-white">
            <tr>
              <th>STT</th>
              <th>Tựa đề</th>
              <th>Mô tả</th>
              <th>Thời gian sự kiện</th>
              <th>Thời gian bán vé</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {events &&
              events.length > 0 &&
              events.map((event, index) => (
                <tr key={index}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{event.title}</td>
                  <td className="p-2">{event.description}</td>
                  <td className="p-2">
                    {`${formatDate(event.startEventDate)} - ${formatDate(
                      event.endEventDate
                    )}`}{" "}
                  </td>
                  <td className=" flex flex-row">
                    <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 text-xs font-bold rounded">
                      {formatDateTime(event.startTime)}
                    </span>
                    <span>-</span>
                    <span className="inline-block bg-green-200 text-green-800 px-2 py-1 text-xs font-bold rounded">
                      {formatDateTime(event.endTime)}
                    </span>
                  </td>
                  <td className="p-2">
                    {event.status ? "Đang mở" : "Đã đóng"}
                  </td>
                  <td className="p-2">
                    {role === "ADMIN" && (
                      <NavLink
                        to={`update-event/${event.id}`}
                        className=" btn transition duration-200"
                      >
                        <FaEdit />
                      </NavLink>
                    )}
                    {role === "ORGANIZER" && (
                      <NavLink
                        to={`manage-check-in/${event.id}`}
                        className=" btn transition duration-200"
                      >
                        Check in
                      </NavLink>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default EventTable;
