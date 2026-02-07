import { Hono } from "hono";
import stripe from "../utils/stripe";
import { producer } from "../utils/kafka";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const webhookRoute = new Hono();
webhookRoute.get("/", (c) => {
    return c.json({
        status: "ok webhook",
        uptime: process.uptime(),
        timestamp: Date.now(),
    });
});
webhookRoute.post("/stripe", async (c) => {
    const body = await c.req.text();
    const sig = c.req.header("stripe-signature");
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    }
    catch (error) {
        console.log("Webhook verification failed!");
        return c.json({ error: "Webhook verification failed!" }, 400);
    }
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ["data.price.product"] });
            // TODO: CREATE ORDER
            producer.send("payment.successful", {
                value: {
                    userId: session.client_reference_id,
                    email: session.customer_details?.email,
                    amount: session.amount_total,
                    status: session.payment_status === "paid" ? "success" : "failed",
                    products: lineItems.data.map((item) => {
                        const product = item.price?.product;
                        return {
                            name: item.description,
                            quantity: item.quantity,
                            price: item.price?.unit_amount,
                            image: product.images?.[0],
                            selectedSize: product.metadata?.selectedSize,
                            selectedColor: product.metadata?.selectedColor,
                            productId: product.metadata?.productId,
                        };
                    }),
                },
            });
            break;
        default:
            break;
    }
    return c.json({ received: true });
});
export default webhookRoute;
