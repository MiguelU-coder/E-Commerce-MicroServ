import Success from "@/components/Success";

const ReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }> | undefined;
}) => {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return <div>No session id found!</div>;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${session_id}`,
  );
  const data = await res.json();

  if (data.status === "open") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Payment Incomplete</h1>
        <p>Your payment session is still open. Please complete the payment.</p>
      </div>
    );
  }

  return <Success paymentStatus={data.status} />;
};

export default ReturnPage;
