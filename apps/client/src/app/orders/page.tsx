import { auth } from "@clerk/nextjs/server";
import { OrderType } from "@repo/types";

const fetchOrders = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data: OrderType[] = await res.json();
  return data;
};

const OrdersPage = async () => {
  const orders = await fetchOrders();

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">No orders found</h2>
        <p className="text-gray-500 mt-2">
          Looks like you haven't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center text-sm">
              <div className="flex gap-8 text-gray-600">
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-medium text-gray-500 mb-1">
                    Order Placed
                  </span>
                  <span className="font-medium text-gray-900">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-medium text-gray-500 mb-1">
                    Total
                  </span>
                  <span className="font-medium text-gray-900">
                    ${(order.amount / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-medium text-gray-500 mb-1">
                    Order ID
                  </span>
                  <span className="font-mono text-gray-900">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 uppercase tracking-wide">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  {order.status}
                </div>

                <a
                  href={`/orders/${order._id}/track`}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Track Package
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-4">
                {order.products?.map((product, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 border border-gray-200 overflow-hidden relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.selectedSize && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Size: {product.selectedSize}
                          </span>
                        )}
                        {product.selectedColor && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            <span
                              className="w-2 h-2 rounded-full mr-1.5 border border-gray-300"
                              style={{
                                backgroundColor:
                                  product.selectedColor.toLowerCase(),
                              }}
                            />
                            {product.selectedColor}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-sm text-gray-500">
                        Qty: {product.quantity || 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
