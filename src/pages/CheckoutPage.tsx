import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { paymentsApi, casesApi } from "../services/api";
import toast from "react-hot-toast";

const STRIPE_PK = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY as
  | string
  | undefined;
const stripePromise = STRIPE_PK ? loadStripe(STRIPE_PK) : null;

const CheckoutInner: React.FC = () => {
  const { id: caseId } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + `/cases/${caseId}`,
      },
      redirect: "if_required",
    });
    if (error) {
      toast.error(error.message || "Payment failed");
      setSubmitting(false);
      return;
    }
    if (
      paymentIntent &&
      (paymentIntent.status === "succeeded" ||
        paymentIntent.status === "requires_capture")
    ) {
      try {
        await paymentsApi.confirm(paymentIntent.id);
        toast.success("Payment successful. Case engaged.");
        navigate(`/cases/${caseId}`);
      } catch (e: any) {
        toast.error(e.response?.data?.message || "Failed to finalize payment");
      }
    } else {
      toast("Payment processing. Please wait...");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        loading={submitting}
        disabled={!stripe || submitting}
      >
        Pay
      </Button>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  const { id: caseId, quoteId } = useParams();
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const appearance = useMemo(() => ({ theme: "stripe" as const }), []);

  useEffect(() => {
    const init = async () => {
      try {
        if (!caseId || !quoteId) return;
        const c = await casesApi.getById(caseId);
        const quote = (c.data.quotes || []).find(
          (qq: any) => qq.id === quoteId
        );
        setAmount(quote ? quote.amount : null);
        const res = await paymentsApi.createIntent(quoteId);
        setClientSecret(res.data.clientSecret);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [caseId, quoteId]);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
          {loading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <p className="text-gray-600">
              You are paying {amount ? `$${amount}` : "the selected amount"} for
              this case.
            </p>
          )}
        </Card>

        <Card>
          {!STRIPE_PK ? (
            <div className="text-sm text-red-600">
              Missing Stripe publishable key in env.
            </div>
          ) : loading || !clientSecret ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner size="md" />
            </div>
          ) : stripePromise ? (
            <Elements
              stripe={stripePromise}
              options={
                {
                  appearance,
                  clientSecret: clientSecret || "",
                } as StripeElementsOptions
              }
            >
              <CheckoutInner />
            </Elements>
          ) : (
            <div className="text-sm text-red-600">
              Stripe failed to initialize.
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CheckoutPage;
