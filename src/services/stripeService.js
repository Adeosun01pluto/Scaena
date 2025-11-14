// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe('pk_test_51ST10eDm6bVJ0ZLra4Ld22BNYo9deyBilbP2eV4z3wqeo8GGOpl9MGSRXUfj77yui1T53gHHXiZVwzTIakCFpEdr00eXRiMemI');

// const BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL;

// const CREATE_CHECKOUT_URL = `${BASE_URL}/createCheckoutSession`;
// const CREATE_PAYMENT_URL  = `${BASE_URL}/createPaymentIntent`;
// const GET_ORDER_URL       = `${BASE_URL}/getOrder`;
// const GET_USER_ORDERS_URL = `${BASE_URL}/getUserOrders`;


// export async function createCheckoutSession(items, userId = null) {
//   try {
//     const response = await fetch(CREATE_CHECKOUT_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         items,
//         userId,
//         successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//         cancelUrl: `${window.location.origin}/cart`,
//       }),
//     });

//     if (!response.ok) {
//       // 👇 new: log raw body so we see what the function sent
//       const text = await response.text();
//       console.error('Checkout backend error body:', text);

//       let error;
//       try {
//         error = JSON.parse(text);
//       } catch {
//         error = {};
//       }

//       throw new Error(error.error || 'Failed to create checkout session');
//     }

//     const { url, sessionId } = await response.json();

//     // Prefer the URL returned by the server (new Stripe.js way)
//     if (url) {
//       window.location.href = url;
//       return;
//     }

//     // (Optional fallback if you ever use an older Stripe.js version)
//     const stripe = await stripePromise;
//     const { error } = await stripe.redirectToCheckout({ sessionId });
//     if (error) throw error;
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     throw error;
//   }
// }


// export async function createPaymentIntent(amount, currency = 'usd', metadata = {}) {
//   const response = await fetch(CREATE_PAYMENT_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ amount, currency, metadata }),
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.error || 'Failed to create payment intent');
//   }

//   return response.json();
// }

// export async function getOrder(orderId) {
//   const response = await fetch(`${GET_ORDER_URL}?orderId=${orderId}`);
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.error || 'Failed to fetch order');
//   }
//   return response.json();
// }

// export async function getUserOrders(userId) {
//   const response = await fetch(`${GET_USER_ORDERS_URL}?userId=${userId}`);
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.error || 'Failed to fetch orders');
//   }
//   const data = await response.json();
//   return data.orders;
// }

// export { stripePromise };





import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51ST10eDm6bVJ0ZLra4Ld22BNYo9deyBilbP2eV4z3wqeo8GGOpl9MGSRXUfj77yui1T53gHHXiZVwzTIakCFpEdr00eXRiMemI"
);

const BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL;

const CREATE_CHECKOUT_URL = `${BASE_URL}/createCheckoutSession`;
const CREATE_PAYMENT_URL = `${BASE_URL}/createPaymentIntent`;
const GET_ORDER_URL = `${BASE_URL}/getOrder`;
const GET_USER_ORDERS_URL = `${BASE_URL}/getUserOrders`;

/**
 * Create a Stripe Checkout Session and redirect the user.
 * Items shape:
 *  {
 *    name: string,
 *    description?: string,
 *    price: number,
 *    quantity: number,
 *    image?: string
 *  }
 */
export async function createCheckoutSession(items, userId = null) {
  try {
    const response = await fetch(CREATE_CHECKOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        userId,
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/cart`,
      }),
    });

    if (!response.ok) {
      // log raw body to debug backend errors
      const text = await response.text();
      console.error("Checkout backend error body:", text);

      let error;
      try {
        error = JSON.parse(text);
      } catch {
        error = {};
      }

      throw new Error(error.error || "Failed to create checkout session");
    }

    const { url, sessionId } = await response.json();

    // ✅ Preferred modern way: redirect using the URL from Stripe
    if (url) {
      window.location.href = url;
      return;
    }

    // Fallback: use redirectToCheckout if URL not provided
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) throw error;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

/**
 * Optional: PaymentIntent-based flow (not used in your current UI, but kept for later)
 */
export async function createPaymentIntent(
  amount,
  currency = "usd",
  metadata = {}
) {
  const response = await fetch(CREATE_PAYMENT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, metadata }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to create payment intent");
  }

  return response.json();
}

/**
 * Fetch a single order by Stripe session id.
 * Used in /checkout/success page.
 */
export async function getOrder(orderId) {
  const response = await fetch(`${GET_ORDER_URL}?orderId=${orderId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to fetch order");
  }
  return response.json();
}

/**
 * Fetch all orders for a given userId (used in Profile page).
 */
export async function getUserOrders(userId) {
  const response = await fetch(`${GET_USER_ORDERS_URL}?userId=${userId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to fetch orders");
  }
  const data = await response.json();
  return data.orders;
}

export { stripePromise };
