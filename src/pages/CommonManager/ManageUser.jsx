import { message, Pagination } from "antd";
import { getAllAccount } from "../../api/accountApi";
import { useEffect, useState } from "react";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const ManageUser = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const itemsPerPage = 10;
  const fetchData = async (page) => {
    try {
      setIsLoading(true);
      const data = await getAllAccount(page, itemsPerPage);
      if (data.isSuccess) {
        debugger;

        setAccounts(data.result?.items);
        setTotalItems(data.result.totalPages);
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalItems; i++) {
      pages.push(
        <button
          key={i}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currentPage === i ? "bg-primary text-white" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };
  const roleStaff = ["customer", "organizer", "staff", "pm"];
  const roleSponsor = ["customer", "sponsor", "organizer"];
  const rolePM = ["customer", "pm", "sponsor"];
  const roleCus = ["customer"];

  const roleAdmin = [
    "customer",
    "admin",
    "organizer",
    "staff",
    "pm",
    "sponsor",
  ];

  const renderRoles = (roleArray) => {
    const roles = roleArray.map((role) => role.normalizedName);
    if (roleStaff.every((role) => roles.includes(role))) return "Nhân viên";
    else if (roleSponsor.every((role) => roles.includes(role)))
      return "Nhà tổ chức";
    else if (rolePM.every((role) => roles.includes(role)))
      return "Quản lý dự án";
    else if (roleAdmin.every((role) => roles.includes(role)))
      return "Quản trị hệ thống";
    else return "Khách hàng";
  };
  const renderPermissionButtons = (roleArray) => {
    const permissions = [];
    if (renderRoles(roleArray) === "Khách hàng") {
      permissions.push(
        <button
          key="quanlyduan"
          className="bg-blue-800 text-white px-4 py-2 w-48 rounded-md"
        >
          <i className="fas fa-user-edit"></i> Quản lý dự án
        </button>
      );
      permissions.push(
        <button
          key="nhatochuc"
          className="bg-yellow-600 text-white my-2 px-4 py-2 w-48 rounded-md"
        >
          <i className="fas fa-user-edit"></i> Nhà tổ chức
        </button>
      );
      permissions.push(
        <button
          key="nhanvien"
          className="bg-green-600 text-white px-4 py-2 w-48 rounded-md"
        >
          <i className="fas fa-user-edit"></i> Nhân viên
        </button>
      );
    }
    console.log(permissions);

    return <div className=" flex flex-col">{permissions}</div>;
  };
  return (
    <div>
      <LoadingComponent isLoading={isLoading} title={"Đang tải dữ liệu"} />
      <h1 className="text-center font-bold text-primary text-xl">
        QUẢN TRỊ NGƯỜI DÙNG TẠI HỆ THỐNG CÓC EVENT
      </h1>
      <div className="overflow-x-auto rounded-lg my-10 shadow-md">
        <table className="table">
          <thead className="bg-primary text-white">
            <tr className="h-10 ">
              <th className="text-center">STT</th>
              <th className="text-center">Tên</th>
              <th className="text-center">Email</th>
              <th className="text-center">Số điện thoại</th>
              <th className="text-center">Quyền</th>
              <th className="text-center">Trạng thái </th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {accounts &&
              accounts.length > 0 &&
              accounts.map((item, index) => (
                <tr key={index} className="h-10 hover">
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{`${item.firstName} ${item.lastName}`}</td>
                  <td className="text-center lowercase text-wrap">
                    {item.email}
                  </td>
                  <td className="text-center">{item.phoneNumber}</td>
                  <td className="text-center">{renderRoles(item.role)}</td>
                  <td className="text-center">
                    {item.isVerified ? (
                      <i className="fa-solid fa-circle-check text-green-600"></i>
                    ) : (
                      <i className="fa-solid fa-circle-xmark text-red-600"></i>
                    )}
                  </td>
                  <td>{renderPermissionButtons(item.role)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {currentPage > 1 && (
          <button
            className="px-4 py-2 mx-1 rounded-lg bg-primary text-white"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
        )}
        {currentPage > 2 && <span className="px-4 py-2 mx-1">..</span>}
        {renderPageNumbers()}
        {currentPage < totalItems - 1 && (
          <span className="px-4 py-2 mx-1">..</span>
        )}
        {currentPage < totalItems && (
          <button
            className="px-4 py-2 mx-1 rounded-lg  bg-primary text-white"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
export default ManageUser;
