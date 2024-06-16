import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../../redux/features/cartSlice";
import { formatDateTime, formatPrice } from "../../utils/util";
import { createOrderWithPament } from "../../api/orderApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { message } from "antd";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart || []);
  const user = useSelector((state) => state.user.user || {});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const selectTotal = (state) =>
    state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = useSelector(selectTotal || 0);

  console.log(cartItems);

  const checkOut = async () => {
    setIsLoading(true);
    const data = {
      seatRank: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      accountId: user?.id,
      content: "Đặt vé ",
    };
    console.log(data);

    const response = await createOrderWithPament(data);
    if (response) {
      debugger;
      setIsLoading(false);
    }
    if (response.isSuccess) {
      debugger;
      message.success("Đặt vé thành công");
    } else {
      response.messages.forEach((mess) => {
        message.error(mess);
      });
    }
  };
  console.log(user);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <LoadingComponent
        isLoading={isLoading}
        title={"Hệ thống đang xử lý đơn hàng"}
      />
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h2>
      {cartItems.length > 0 ? (
        <>
          <div className="bg-white shadow-lg rounded-lg divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-6 flex items-center justify-between w-full"
              >
                <div className="flex items-center">
                  <div>
                    <div className="flex ">
                      <strong className="text-lg mr-2">Event:</strong>
                      <h3 className="text-lg  text-gray-900">
                        {item.event?.title}
                      </h3>
                    </div>
                    <div className="flex ">
                      <strong className="text-lg mr-2">Hạng vé:</strong>
                      <h3 className="text-lg  text-gray-900">{item.name}</h3>
                    </div>

                    <p className="text-gray-500">
                      Giá: {formatPrice(item.price)}
                    </p>
                    <p className="text-gray-500">
                      Thời gian mở bán: {formatDateTime(item.startTime)}
                    </p>
                    <p className="text-gray-500">
                      Thời gian kết thuc: {formatDateTime(item.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(increaseQuantity(item.id))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white shadow-lg rounded-lg p-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Tổng tiền</h3>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(total)}
            </span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={checkOut}
              className="mt-8 px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Thanh toán ngay
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Giỏ hàng chưa có sản phẩm nào.</p>
      )}
    </div>
  );
};

export default Cart;
