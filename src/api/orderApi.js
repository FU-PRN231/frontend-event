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
