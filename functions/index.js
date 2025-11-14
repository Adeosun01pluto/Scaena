// require('dotenv').config();
// const cors = require('cors')({ origin: true });
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');

// admin.initializeApp();
// const db = admin.firestore();

// // 🔑 Lazy Stripe initialization
// let stripeClient = null;

// function getStripe() {
//   if (stripeClient) return stripeClient;

//   // In Cloud Functions runtime this will contain your config
//   let secretKey;

//   try {
//     const cfg = functions.config && functions.config();
//     secretKey = cfg?.stripe?.secret_key;
//   } catch (e) {
//     // functions.config() can throw when run locally / during analysis
//     secretKey = undefined;
//   }

//   // Fallback for local testing / emulator
//   if (!secretKey && process.env.STRIPE_SECRET_KEY) {
//     secretKey = process.env.STRIPE_SECRET_KEY;
//   }

//   if (!secretKey) {
//     console.error('❌ Stripe secret key not configured');
//     return null;
//   }

//   stripeClient = require('stripe')(secretKey);
//   return stripeClient;
// }



// // Create Payment Intent
// exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
//   // CORS headers
//   res.set('Access-Control-Allow-Origin', '*');
//   res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   res.set('Access-Control-Allow-Headers', 'Content-Type');

//   // Preflight
//   if (req.method === 'OPTIONS') {
//     return res.status(204).send('');
//   }

//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const stripe = getStripe();
//   if (!stripe) {
//     return res.status(500).json({ error: 'Stripe not configured' });
//   }


//   try {
//     const { amount, currency = 'usd', metadata = {} } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ error: 'Invalid amount' });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100),
//       currency,
//       metadata,
//       automatic_payment_methods: { enabled: true },
//     });

//     return res.status(200).json({
//       clientSecret: paymentIntent.client_secret,
//       paymentIntentId: paymentIntent.id,
//     });
//   } catch (error) {
//     console.error('Error creating payment intent:', error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// // Create Checkout Session

// exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
//   // CORS
//   res.set('Access-Control-Allow-Origin', '*');
//   res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   res.set('Access-Control-Allow-Headers', 'Content-Type');

//   if (req.method === 'OPTIONS') {
//     return res.status(204).send('');
//   }

//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const stripe = getStripe();
//   if (!stripe) {
//     console.error('Stripe not configured in runtime');
//     return res.status(500).json({ error: 'Stripe not configured' });
//   }

//   try {
//     const { items, userId, successUrl, cancelUrl } = req.body;

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ error: 'Invalid items' });
//     }

//     const lineItems = items.map((item) => {
//       const productData = {
//         name: item.name,
//         images: item.image ? [item.image] : [],
//       };

//       // Only include description if it’s non-empty
//       if (item.description && item.description.trim() !== '') {
//         productData.description = item.description.trim();
//       }

//       return {
//         price_data: {
//           currency: 'usd',
//           product_data: productData,
//           unit_amount: Math.round(item.price * 100),
//         },
//         quantity: item.quantity,
//       };
//     });


//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: lineItems,
//       mode: 'payment',
//       success_url:
//         successUrl ||
//         `${req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: cancelUrl || `${req.headers.origin}/cart`,
//       metadata: { userId: userId || 'guest' },
//       shipping_address_collection: {
//         allowed_countries: ['US', 'CA', 'GB', 'AU'],
//       },
//     });

//     return res.status(200).json({
//       sessionId: session.id,
//       url: session.url,
//     });
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     // 🔴 Make sure we return `error` *with* the message
//     return res.status(500).json({
//       error: error.message || 'Internal server error',
//       type: error.type || undefined,
//     });
//   }
// });


// // Stripe Webhook Handler
// exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
//     const stripe = getStripe();
//   if (!stripe) {
//     return res.status(500).json({ error: 'Stripe not configured' });
//   }

//   const sig = req.headers['stripe-signature'];
//   const cfg = functions.config ? functions.config() : {};
//   const webhookSecret =
//     cfg.stripe?.webhook_secret ||
//     process.env.STRIPE_WEBHOOK_SECRET;
//   if (!webhookSecret) {
//     console.error('Webhook secret not configured');
//     return res.status(500).json({ error: 'Webhook not configured' });
//   }

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   try {
//     switch (event.type) {
//       case 'checkout.session.completed':
//         await handleCheckoutSessionCompleted(event.data.object);
//         break;
      
//       case 'payment_intent.succeeded':
//         await handlePaymentIntentSucceeded(event.data.object);
//         break;
      
//       case 'payment_intent.payment_failed':
//         await handlePaymentIntentFailed(event.data.object);
//         break;
      
//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }

//     res.status(200).json({ received: true });
//   } catch (error) {
//     console.error('Error handling webhook:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// async function handleCheckoutSessionCompleted(session) {
//   console.log('Checkout session completed:', session.id);

//   try {
//     const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
//       expand: ['line_items', 'customer', 'payment_intent'],
//     });

//     const orderData = {
//       sessionId: session.id,
//       paymentIntentId: session.payment_intent,
//       customerId: session.customer,
//       userId: session.metadata?.userId || 'guest',
//       amount: session.amount_total / 100,
//       currency: session.currency,
//       status: 'completed',
//       paymentStatus: session.payment_status,
//       customerEmail: session.customer_details?.email,
//       shippingAddress: session.shipping_details?.address,
//       items: fullSession.line_items?.data || [],
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     await db.collection('orders').doc(session.id).set(orderData);

//     if (session.metadata?.userId && session.metadata.userId !== 'guest') {
//       await db.collection('users').doc(session.metadata.userId).update({
//         orders: admin.firestore.FieldValue.arrayUnion(session.id),
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//     }

//     console.log('Order created successfully:', session.id);
//   } catch (error) {
//     console.error('Error creating order:', error);
//     throw error;
//   }
// }

// async function handlePaymentIntentSucceeded(paymentIntent) {
//   console.log('Payment intent succeeded:', paymentIntent.id);

//   try {
//     await db.collection('payments').doc(paymentIntent.id).set({
//       paymentIntentId: paymentIntent.id,
//       amount: paymentIntent.amount / 100,
//       currency: paymentIntent.currency,
//       status: 'succeeded',
//       metadata: paymentIntent.metadata,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });
//   } catch (error) {
//     console.error('Error recording payment:', error);
//   }
// }

// async function handlePaymentIntentFailed(paymentIntent) {
//   console.log('Payment intent failed:', paymentIntent.id);

//   try {
//     await db.collection('payments').doc(paymentIntent.id).set({
//       paymentIntentId: paymentIntent.id,
//       amount: paymentIntent.amount / 100,
//       currency: paymentIntent.currency,
//       status: 'failed',
//       errorMessage: paymentIntent.last_payment_error?.message,
//       metadata: paymentIntent.metadata,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });
//   } catch (error) {
//     console.error('Error recording failed payment:', error);
//   }
// }

// // Get order details
// exports.getOrder = functions.https.onRequest(async (req, res) => {
//   // CORS headers
//   res.set('Access-Control-Allow-Origin', '*');
//   res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
//   res.set('Access-Control-Allow-Headers', 'Content-Type');

//   if (req.method === 'OPTIONS') {
//     return res.status(204).send('');
//   }

//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const { orderId } = req.query;

//     if (!orderId) {
//       return res.status(400).json({ error: 'Order ID required' });
//     }

//     const orderDoc = await db.collection('orders').doc(orderId).get();

//     if (!orderDoc.exists) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     return res.status(200).json({
//       id: orderDoc.id,
//       ...orderDoc.data(),
//     });
//   } catch (error) {
//     console.error('Error fetching order:', error);
//     return res.status(500).json({ error: error.message });
//   }
// });


// // Get user orders
// exports.getUserOrders = functions.https.onRequest(async (req, res) => {
//   // CORS headers
//   res.set('Access-Control-Allow-Origin', '*');
//   res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
//   res.set('Access-Control-Allow-Headers', 'Content-Type');

//   if (req.method === 'OPTIONS') {
//     return res.status(204).send('');
//   }

//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({ error: 'User ID required' });
//     }

//     const ordersSnapshot = await db
//       .collection('orders')
//       .where('userId', '==', userId)
//       .orderBy('createdAt', 'desc')
//       .get();

//     const orders = [];
//     ordersSnapshot.forEach((doc) => {
//       orders.push({
//         id: doc.id,
//         ...doc.data(),
//       });
//     });

//     return res.status(200).json({ orders });
//   } catch (error) {
//     console.error('Error fetching user orders:', error);
//     return res.status(500).json({ error: error.message });
//   }
// });































require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// 🔑 Lazy Stripe initialization
let stripeClient = null;

function getStripe() {
  if (stripeClient) return stripeClient;

  let secretKey;

  try {
    const cfg = functions.config && functions.config();
    secretKey = cfg?.stripe?.secret_key;
  } catch (e) {
    secretKey = undefined;
  }

  // Fallback for local testing / emulator
  if (!secretKey && process.env.STRIPE_SECRET_KEY) {
    secretKey = process.env.STRIPE_SECRET_KEY;
  }

  if (!secretKey) {
    console.error("❌ Stripe secret key not configured");
    return null;
  }

  stripeClient = require("stripe")(secretKey);
  return stripeClient;
}

/**
 * Helper: map a full Stripe Checkout Session into a Firestore order document
 */
function mapStripeSessionToOrder(fullSession) {
  const paymentIntent =
    typeof fullSession.payment_intent === "string"
      ? fullSession.payment_intent
      : fullSession.payment_intent?.id;

  return {
    sessionId: fullSession.id,
    paymentIntentId: paymentIntent || null,
    customerId:
      typeof fullSession.customer === "string"
        ? fullSession.customer
        : fullSession.customer?.id || null,
    userId: fullSession.metadata?.userId || "guest",

    amount: (fullSession.amount_total || 0) / 100,
    currency: fullSession.currency || "usd",

    status: "completed", // internal status
    paymentStatus: fullSession.payment_status,

    customerEmail: fullSession.customer_details?.email || null,
    customerName: fullSession.customer_details?.name || null,
    shippingAddress: fullSession.shipping_details?.address || null,

    // Raw Stripe line_items:
    items: fullSession.line_items?.data || [],

    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

// -----------------------------------------------------------------------------
// Create Payment Intent (not required for your current Checkout, but kept)
// -----------------------------------------------------------------------------
exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = getStripe();
  if (!stripe) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  try {
    const { amount, currency = "usd", metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------------------
// Create Checkout Session
// -----------------------------------------------------------------------------
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = getStripe();
  if (!stripe) {
    console.error("Stripe not configured in runtime");
    return res.status(500).json({ error: "Stripe not configured" });
  }

  try {
    const { items, userId, successUrl, cancelUrl } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid items" });
    }

    const lineItems = items.map((item) => {
      const productData = {
        name: item.name,
        images: item.image ? [item.image] : [],
      };

      if (item.description && item.description.trim() !== "") {
        productData.description = item.description.trim();
      }

      return {
        price_data: {
          currency: "usd",
          product_data: productData,
          unit_amount: Math.round(Number(item.price || 0) * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        successUrl ||
        `${req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/cart`,
      metadata: { userId: userId || "guest" },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
      type: error.type || undefined,
    });
  }
});

// -----------------------------------------------------------------------------
// Stripe Webhook Handler
// -----------------------------------------------------------------------------
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  const sig = req.headers["stripe-signature"];
  const cfg = functions.config ? functions.config() : {};
  const webhookSecret =
    cfg.stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Webhook secret not configured");
    return res.status(500).json({ error: "Webhook not configured" });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * When Stripe marks the checkout session as completed
 * → fetch full session, map it, and write to Firestore.
 */
async function handleCheckoutSessionCompleted(session) {
  console.log("Checkout session completed:", session.id);

  const stripe = getStripe();
  if (!stripe) {
    console.error(
      "Stripe not configured when handling checkout.session.completed"
    );
    throw new Error("Stripe not configured");
  }

  try {
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "customer", "payment_intent"],
    });

    const orderData = mapStripeSessionToOrder(fullSession);

    // Idempotent: set with merge so repeated webhook calls are safe
    await db
      .collection("orders")
      .doc(fullSession.id)
      .set(orderData, { merge: true });

    if (orderData.userId && orderData.userId !== "guest") {
      await db
        .collection("users")
        .doc(orderData.userId)
        .set(
          {
            orders: admin.firestore.FieldValue.arrayUnion(fullSession.id),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
    }

    console.log("Order created/updated successfully:", fullSession.id);
  } catch (error) {
    console.error("Error creating order from checkout session:", error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log("Payment intent succeeded:", paymentIntent.id);

  try {
    await db
      .collection("payments")
      .doc(paymentIntent.id)
      .set({
        paymentIntentId: paymentIntent.id,
        amount: (paymentIntent.amount || 0) / 100,
        currency: paymentIntent.currency,
        status: "succeeded",
        metadata: paymentIntent.metadata,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error("Error recording payment:", error);
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  console.log("Payment intent failed:", paymentIntent.id);

  try {
    await db
      .collection("payments")
      .doc(paymentIntent.id)
      .set({
        paymentIntentId: paymentIntent.id,
        amount: (paymentIntent.amount || 0) / 100,
        currency: paymentIntent.currency,
        status: "failed",
        errorMessage: paymentIntent.last_payment_error?.message,
        metadata: paymentIntent.metadata,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error("Error recording failed payment:", error);
  }
}

// -----------------------------------------------------------------------------
// Get order details (used by /checkout/success)
// With fallback to Stripe if Firestore doesn't have it yet
// -----------------------------------------------------------------------------
exports.getOrder = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID required" });
    }

    // 1) Try Firestore first
    const orderDoc = await db.collection("orders").doc(orderId).get();

    if (orderDoc.exists) {
      return res.status(200).json({
        id: orderDoc.id,
        ...orderDoc.data(),
      });
    }

    // 2) Fallback to Stripe if webhook was slow/failed
    const stripe = getStripe();
    if (!stripe) {
      console.error("Stripe not configured in getOrder fallback");
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const fullSession = await stripe.checkout.sessions.retrieve(orderId, {
        expand: ["line_items", "customer", "payment_intent"],
      });

      if (!fullSession || fullSession.status !== "complete") {
        return res
          .status(404)
          .json({ error: "Order not found or not completed yet" });
      }

      const orderData = mapStripeSessionToOrder(fullSession);

      await db
        .collection("orders")
        .doc(orderId)
        .set(orderData, { merge: true });

      return res.status(200).json({
        id: orderId,
        ...orderData,
      });
    } catch (stripeErr) {
      console.error("Stripe lookup failed in getOrder fallback:", stripeErr);
      return res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
});

// -----------------------------------------------------------------------------
// Get user orders
// -----------------------------------------------------------------------------
exports.getUserOrders = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const ordersSnapshot = await db
      .collection("orders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const orders = [];
    ordersSnapshot.forEach((docSnap) => {
      orders.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ error: error.message });
  }
});
