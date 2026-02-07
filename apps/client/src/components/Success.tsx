"use client";

import useCartStore from "@/stores/cartStore";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const Success = ({ paymentStatus }: { paymentStatus: string }) => {
  const { clearCart } = useCartStore();
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (paymentStatus === "succeeded") {
      clearCart();
    }
  }, [paymentStatus, clearCart]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      {paymentStatus === "succeeded" && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-4 bg-green-100 rounded-full animate-pulse" />
            <div className="relative bg-green-500 rounded-full p-4">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Successful!
            </h1>
            <p className="text-gray-500">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-green-600 capitalize bg-green-50 px-3 py-1 rounded-full border border-green-200">
                {paymentStatus}
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full gap-3 pt-4">
            <Link
              href="/orders"
              className="w-full bg-black text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              View Order Details
            </Link>
            <Link
              href="/"
              className="w-full bg-white text-gray-700 py-3.5 px-6 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Need help?{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
