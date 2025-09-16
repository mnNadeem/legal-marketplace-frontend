import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { casesApi, filesApi } from "../services/api";
import { Case, Quote } from "../types";
import { DollarSign, Clock, FileText, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const CaseDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["case", id],
    queryFn: () => casesApi.getById(id as string),
    enabled: Boolean(id),
  });

  const caseData: Case | undefined = data?.data;

  const isClientOwner =
    user?.role === "client" && user?.id === caseData?.clientId;
  const isAcceptedAndEngaged = (quote: Quote) =>
    quote.status === "accepted" && caseData?.status === "engaged";

  const handleDownload = async (fileId: string) => {
    try {
      const res = await filesApi.getSecureUrl(fileId);
      console.log(res);
      const url: string | undefined = (res.data as any)?.url;
      const token: string | undefined = (res.data as any)?.token;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else if (token) {
        window.open(
          `/files/secure/${fileId}?token=${encodeURIComponent(token)}`,
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        toast.error("No secure download URL from server");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to get download link");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!caseData) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12">
          <h3 className="text-sm font-medium text-gray-900">Case not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The requested case does not exist.
          </p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {caseData.title}
            </h1>
            <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(caseData.createdAt).toLocaleString()}
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {caseData.status}
              </span>
            </div>
          </div>
        </div>

        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Description
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {caseData.description}
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Documents
            </h3>
            {caseData.files && caseData.files.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {caseData.files.map((f) => (
                  <li
                    key={f.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center text-gray-700">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{f.originalName}</span>
                    </div>
                    {isClientOwner ||
                    (user?.role === "lawyer" &&
                      caseData.status === "engaged" &&
                      caseData.quotes?.some(
                        (q) => q.lawyerId === user.id && q.status === "accepted"
                      )) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(f.id)}
                      >
                        Download
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400">No access</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded.</p>
            )}
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Quotes</h3>
                {isClientOwner && caseData.status === "open" && (
                  <span className="text-sm text-gray-600">
                    {caseData.quotes?.length || 0} received
                  </span>
                )}
              </div>

              {caseData.quotes && caseData.quotes.length > 0 ? (
                <div className="space-y-3">
                  {caseData.quotes.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 border rounded-md flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />${q.amount}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {q.expectedDays} days
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${q.status === "accepted" ? "bg-green-100 text-green-800" : q.status === "rejected" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}
                          >
                            {q.status}
                          </span>
                        </div>
                        {q.note && (
                          <p className="text-sm text-gray-700">{q.note}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {isAcceptedAndEngaged(q) && (
                          <span className="inline-flex items-center text-green-700 text-sm">
                            <CheckCircle className="h-4 w-4 mr-1" /> Accepted
                          </span>
                        )}
                        {isClientOwner &&
                          caseData.status === "open" &&
                          q.status === "proposed" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/cases/${caseData.id}/checkout/${q.id}`
                                )
                              }
                            >
                              Accept & Pay
                            </Button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No quotes yet.</p>
              )}
            </Card>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          {user?.role === "lawyer" && caseData.status === "open" && (
            <Link to={`/cases/${caseData.id}/quote`}>
              <Button>Submit/Update Quote</Button>
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CaseDetailPage;
