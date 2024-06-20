import { jwtDecode } from "jwt-decode";
const assignRole = (userRole) => {
  if (userRole.includes("ADMIN")) {
    return "isAdmin";
  } else if (userRole.includes("STAFF")) {
    return "isStaff";
  } else if (userRole.includes("ORGANIZER")) {
    return "isOrganizer";
  } else if (userRole.includes("PM")) {
    return "isPM";
  } else if (
    !userRole.includes("ADMIN") &&
    !userRole.includes("STAFF") &&
    !userRole.includes("PM") &&
    !userRole.includes("ORGANIZER")
  ) {
    return "isUser";
  }
};

export const decode = (token) => {
  const decoded = jwtDecode(token);
  const role =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const roleName = assignRole(role);

  return {
    accountId: decoded.AccountId,
    expire: decoded.exp,
    role: roleName,
  };
};
