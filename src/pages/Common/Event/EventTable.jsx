import { formatDate, formatDateTime } from "../../../utils/util";

const EventTable = ({ events }) => {
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
                  <td className=" flex flex-col">
                    <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 text-xs font-bold rounded">
                      Start: {formatDateTime(event.startTime)}
                    </span>
                    <span className="inline-block bg-green-200 text-green-800 px-2 py-1 text-xs font-bold rounded my-2">
                      End: {formatDateTime(event.endTime)}
                    </span>
                  </td>
                  <td className="p-2">
                    <button className="btn hover:bg-blue-500 transition duration-200">
                      Xem chi tiết
                    </button>
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
