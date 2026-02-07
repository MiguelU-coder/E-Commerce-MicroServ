"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle2, History } from "lucide-react";

// Dynamically import map component to avoid SSR issues with Leaflet
const TrackingMap = dynamic(() => import("@/components/TrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
      <span className="text-gray-400 font-medium">Loading Map...</span>
    </div>
  ),
});

const TrackOrderPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link
          href="/orders"
          className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
        <p className="text-gray-500 mt-2">Real-time status updates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Map & Status */}
        <div className="lg:col-span-2 space-y-6">
          <TrackingMap orderId="mock-id" />

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Shipment Progress</h3>
            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-8 bg-green-500 rounded-full p-1.5 ring-4 ring-white">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Order Confirmed</h4>
                  <p className="text-sm text-gray-500">
                    Your order has been verified.
                  </p>
                  <span className="text-xs text-gray-400 block mt-1">
                    Today, 9:41 AM
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-8 bg-green-500 rounded-full p-1.5 ring-4 ring-white">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Packed</h4>
                  <p className="text-sm text-gray-500">
                    Order packed and ready for pickup.
                  </p>
                  <span className="text-xs text-gray-400 block mt-1">
                    Today, 2:30 PM
                  </span>
                </div>
              </div>

              {/* Step 3 (Current) */}
              <div className="relative">
                <div className="absolute -left-8 bg-indigo-600 rounded-full p-1.5 ring-4 ring-indigo-100">
                  <Truck className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h4 className="font-medium text-indigo-600">
                    Out for Delivery
                  </h4>
                  <p className="text-sm text-gray-600">
                    Driver is on the way to your location.
                  </p>
                  <span className="text-xs text-indigo-500 font-medium block mt-1">
                    Est. Delivery: 5:00 PM
                  </span>
                </div>
              </div>

              {/* Step 4 (Future) */}
              <div className="relative opacity-50">
                <div className="absolute -left-8 bg-gray-200 rounded-full p-1.5 ring-4 ring-white">
                  <div className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Delivered</h4>
                  <p className="text-sm text-gray-500">
                    Package will be left at front door.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Details */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <History className="w-4 h-4" />
              Order Summary
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono text-gray-900">#ORD-7392-XJ</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-500">Estimated Delivery</span>
                <span className="font-medium text-gray-900">Today by 8 PM</span>
              </div>
              <div className="pt-2">
                <p className="text-gray-500 mb-2">Delivery Address</p>
                <p className="font-medium text-gray-900">
                  123 Innovation Dr, Suite 400
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </div>

            <button className="w-full mt-6 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
