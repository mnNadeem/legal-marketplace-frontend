import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Filter, Clock, DollarSign, FileText, Eye } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { casesApi } from "../services/api";
import { extractList, extractTotal } from "../utils/apiHelpers";

const LawyerMarketplace: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    category: "",
    createdSince: "",
    page: 1,
    limit: 10,
  });

  const { data: casesData, isLoading } = useQuery({
    queryKey: ["marketplace", filters],
    queryFn: () => casesApi.getAll(filters),
  });

  const raw = casesData?.data;
  const cases = extractList<any>(raw);
  const totalCases = extractTotal(raw, cases);

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "Contract Law", label: "Contract Law" },
    { value: "Criminal Law", label: "Criminal Law" },
    { value: "Family Law", label: "Family Law" },
    { value: "Personal Injury", label: "Personal Injury" },
    { value: "Employment Law", label: "Employment Law" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Intellectual Property", label: "Intellectual Property" },
    { value: "Tax Law", label: "Tax Law" },
    { value: "Immigration", label: "Immigration" },
    { value: "Bankruptcy", label: "Bankruptcy" },
    { value: "Other", label: "Other" },
  ];

  const timeFilterOptions = [
    { value: "", label: "Any time" },
    { value: "2024-01-01T00:00:00.000Z", label: "Last 30 days" },
    { value: "2024-06-01T00:00:00.000Z", label: "Last 6 months" },
    { value: "2023-01-01T00:00:00.000Z", label: "Last year" },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const totalPages = Math.ceil(totalCases / filters.limit);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Legal Marketplace
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Browse open cases and submit quotes to help clients with their
              legal needs.
            </p>
          </div>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                label="Search"
                placeholder="Search cases..."
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              />
            </div>
            <div>
              <Select
                label="Category"
                placeholder="All categories"
                options={categoryOptions}
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              />
            </div>
            <div>
              <Select
                label="Created Since"
                placeholder="Any time"
                options={timeFilterOptions}
                value={filters.createdSince}
                onChange={(e) =>
                  handleFilterChange("createdSince", e.target.value)
                }
              />
            </div>
          </div>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Open Cases ({totalCases})
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>Filtered results</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : cases.length === 0 ? (
            <Card className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No cases found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or check back later for new cases.
              </p>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {cases.map((case_) => (
                  <Card key={case_.id} hover>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">
                            {case_.title}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {case_.category}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {case_.description}
                        </p>

                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Posted{" "}
                            {new Date(case_.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {case_.files?.length || 0} documents
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {case_.quotes?.length || 0} quotes received
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col space-y-2">
                        <Link to={`/cases/${case_.id}`}>
                          <Button
                            size="sm"
                            className="inline-flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        <Link to={`/cases/${case_.id}/quote`}>
                          <Button variant="outline" size="sm">
                            Submit Quote
                          </Button>
                        </Link>
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

        <Card className="bg-blue-50 border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Tips for Success
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Read case details carefully before submitting quotes</li>
                  <li>
                    Provide competitive pricing while ensuring fair compensation
                  </li>
                  <li>Include a detailed note explaining your approach</li>
                  <li>Set realistic timelines for case completion</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LawyerMarketplace;
