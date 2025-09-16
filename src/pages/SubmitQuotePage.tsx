import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { casesApi, quotesApi } from "../services/api";
import { Quote } from "../types";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { extractList } from "../utils/apiHelpers";

interface QuoteFormData {
  amount: number;
  expectedDays: number;
  note?: string;
}

const SubmitQuotePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: caseRes, isLoading: loadingCase } = useQuery({
    queryKey: ["case", id],
    queryFn: () => casesApi.getById(id as string),
    enabled: Boolean(id),
  });

  const { data: caseQuotesRes } = useQuery({
    queryKey: ["caseQuotesForEdit", id],
    queryFn: async () => casesApi.getQuotes(id as string),
    enabled: Boolean(id),
  });

  const { data: myQuotesRes } = useQuery({
    queryKey: ["myQuotesForEdit", id],
    queryFn: async () => quotesApi.getAll({ page: 1, limit: 100 }),
  });

  const existingQuote: Quote | undefined = useMemo(() => {
    const rawMine = myQuotesRes?.data;
    const myList = extractList<Quote>(rawMine);
    const mineForCase = myList.find((q) => q.caseId === id);
    if (mineForCase) return mineForCase;

    const rawCase = caseQuotesRes?.data;
    const caseList = extractList<Quote>(rawCase);
    return caseList.find((q) => q.lawyerId === user?.id);
  }, [myQuotesRes, caseQuotesRes, user, id]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormData>({});

  useEffect(() => {
    if (existingQuote) {
      reset({
        amount: Number((existingQuote as any).amount),
        expectedDays: Number(existingQuote.expectedDays),
        note: existingQuote.note || "",
      });
    }
  }, [existingQuote, reset]);

  const createMutation = useMutation({
    mutationFn: (data: QuoteFormData) => quotesApi.create(id as string, data),
    onSuccess: async () => {
      toast.success("Quote submitted");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["myQuotes"] }),
        queryClient.invalidateQueries({ queryKey: ["case", id] }),
      ]);
      navigate(`/cases/${id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit quote");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { quoteId: string; data: Partial<QuoteFormData> }) =>
      quotesApi.update(payload.quoteId, payload.data),
    onSuccess: async () => {
      toast.success("Quote updated");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["myQuotes"] }),
        queryClient.invalidateQueries({ queryKey: ["case", id] }),
      ]);
      navigate(`/cases/${id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update quote");
    },
  });

  const onSubmit = (form: QuoteFormData) => {
    if (existingQuote) {
      updateMutation.mutate({ quoteId: existingQuote.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  if (loadingCase) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const caseData = caseRes?.data;

  if (!caseData) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12">
          <h3 className="text-sm font-medium text-gray-900">Case not found</h3>
        </Card>
      </DashboardLayout>
    );
  }

  if (caseData.status !== "open") {
    return (
      <DashboardLayout>
        <Card className="text-center py-12">
          <h3 className="text-sm font-medium text-gray-900">
            Case is not open for quotes
          </h3>
          <div className="mt-4">
            <Link to={`/cases/${caseData.id}`}>
              <Button>Back to Case</Button>
            </Link>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {existingQuote ? "Update Quote" : "Submit Quote"}
          </h1>
          <p className="text-gray-600">Case: {caseData.title}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <div className="space-y-6">
              <Input
                label="Amount (USD)"
                type="number"
                step="0.01"
                {...register("amount", {
                  required: "Amount is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Must be at least 1" },
                })}
                error={errors.amount?.message}
              />
              <Input
                label="Expected Days"
                type="number"
                {...register("expectedDays", {
                  required: "Expected days is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Must be at least 1 day" },
                  max: { value: 365, message: "Must be less than 365 days" },
                })}
                error={errors.expectedDays?.message}
              />
              <Textarea
                label="Note (optional)"
                rows={5}
                placeholder="Briefly explain your approach and inclusions"
                {...register("note", {
                  maxLength: { value: 2000, message: "Max 2000 characters" },
                })}
                error={errors.note?.message}
              />
            </div>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={
                isSubmitting ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {existingQuote ? "Update Quote" : "Submit Quote"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default SubmitQuotePage;
