window.EasyLips = window.EasyLips || {};

(function (App) {
  const API_URL = App.API_URL || "http://localhost:8000";

  class PaymentError extends Error {
    constructor(message, { status = 0, details = null } = {}) {
      super(message);
      this.name = "PaymentError";
      this.status = status;
      this.details = details;
    }
  }

  async function parseResponse(response) {
    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new PaymentError("The payment server returned an invalid response.", {
          status: response.status,
        });
      }
    }

    if (!response.ok) {
      throw new PaymentError(
        data?.error?.message || "Payment setup failed. Please try again.",
        {
          status: response.status,
          details: data?.error?.details || null,
        },
      );
    }

    return data;
  }

  async function paymentRequest(path, body) {
    let response;

    try {
      response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch {
      throw new PaymentError(
        "Could not reach the payment server. Start the server and try again.",
      );
    }

    return parseResponse(response);
  }

  App.payments = {
    PaymentError,
    createCreemCheckout(payload = {}) {
      return paymentRequest("/payments/creem/checkouts", payload);
    },
  };
})(window.EasyLips);
