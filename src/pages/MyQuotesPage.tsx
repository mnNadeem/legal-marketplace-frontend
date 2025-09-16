import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock, DollarSign, FileText } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { quotesApi } from "../services/api";
import { extractList, extractTotal } from "../utils/apiHelpers";

const MyQuotesPage: React.FC = () => {
  const [filters, setFilters] = useState({
    status: "all",
    page: 1,
    limit: 10,
  });

  const { data: quotesData, isLoading } = useQuery({
    queryKey: ["myQuotes", filters],
    queryFn: () => quotesApi.getAll(filters),
  });

  const raw = quotesData?.data;
  const quotes = extractList<any>(raw);
  const totalQuotes = extractTotal(raw, quotes);

  const statusFilterOptions = [
    { value: "all", label: "All Statuses" },
    { value: "proposed", label: "Proposed" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "proposed":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const totalPages = Math.ceil(totalQuotes / filters.limit);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Quotes
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your submitted quotes and track their status.
            </p>
          </div>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select
                label="Status"
                placeholder="All statuses"
                options={statusFilterOptions}
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              />
            </div>
          </div>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Quotes ({totalQuotes})
            </h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : quotes.length === 0 ? (
            <Card className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No quotes found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't submitted any quotes yet. Browse the marketplace to
                get started.
              </p>
              <div className="mt-6">
                <Link to="/marketplace">
                  <Button>Browse Marketplace</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <Card key={quote.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">
                            Quote for case:{" "}
                            {quote.case?.title || "Case not found"}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}
                          >
                            {quote.status}
                          </span>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Amount: ${quote.amount}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Expected Days: {quote.expectedDays}
                          </div>
                        </div>

                        {quote.note && (
                          <p className="text-sm text-gray-600">
                            **Note:** {quote.note}
                          </p>
                        )}
                      </div>

                      <div className="ml-4 flex-shrink-0">
                        {quote.status === "accepted" &&
                          quote.case?.status === "engaged" && (
                            <Link to={`/cases/${quote.caseId}`}>
                              <Button size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                View Case & Files
                              </Button>
                            </Link>
                          )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <span>
                      Showing page {filters.page} of {totalPages}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyQuotesPage;
