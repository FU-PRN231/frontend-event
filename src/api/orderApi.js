import axios from "axios";
import { baseUrl } from "./config";

export const createOrderWithPament = async (order) => {
  try {
    const res = await axios.post(
      `${baseUrl}/order/create-order-with-payment`,
      order
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
export const getAllOrderByAccountId = async (id, pageNumber, pageSize) => {
  try {
    const response = await axios.get(
      `${baseUrl}/order/get-all-order-by-accountId/${id}/${pageNumber}/${pageSize}`
    );
    return response.data;
  } catch (error) {}
};
export const getAllOrderDetailsByOrderId = async (id, pageNumber, pageSize) => {
  try {
    const response = await axios.get(
      `${baseUrl}/order/get-all-order-detail-by-order-id/${id}/${pageNumber}/${pageSize}`
    );
    return response.data;
  } catch (error) {}
};
export const purchaseOrder = async (id) => {
  try {
    const response = await axios.post(`${baseUrl}/order/purchase-order/${id}`);
    return response.data;
  } catch (error) {}
};

export const updateStatusOrder = async (id) => {
  try {
    const response = await axios.put(
      `${baseUrl}/order/update-status?orderId=${id}`
    );
    return response.data;
  } catch (error) {}
};
