import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { casesApi } from "../services/api";
import { extractList, extractTotal } from "../utils/apiHelpers";

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user!;

  const { data: casesData, isLoading } = useQuery({
    queryKey: ["cases"],
    queryFn: () => casesApi.getAll({ limit: 10 }),
  });

  const raw = casesData?.data;
  const cases = extractList<any>(raw);
  const totalCases = extractTotal(raw, cases);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "engaged":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "closed":
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "engaged":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = [
    {
      name: "Total Cases",
      value: totalCases,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Open Cases",
      value: cases.filter((c) => c.status === "open").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      name: "Engaged Cases",
      value: cases.filter((c) => c.status === "engaged").length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Total Quotes",
      value: cases.reduce((acc, c) => acc + (c.quotes?.length || 0), 0),
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome back, {user?.name || "Client"}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your legal cases and track quotes from lawyers.
            </p>
          </div>
          {typedUser.role === "client" ? (
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link to="/create-case">
                <Button className="inline-flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Case
                </Button>
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Cases</h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : cases.length === 0 ? (
            <Card className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No cases yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first legal case.
              </p>
              <div className="mt-6">
                <Link to="/create-case">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Case
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {cases.map((case_) => (
                  <li key={case_.id}>
                    <Link
                      to={`/cases/${case_.id}`}
                      className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getStatusIcon(case_.status)}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-primary-600 truncate">
                                {case_.title}
                              </p>
                              <span
                                className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}
                              >
                                {case_.status}
                              </span>
                            </div>
                            <div className="mt-2 flex">
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="truncate">
                                  {case_.category}
                                </span>
                              </div>
                              <div className="ml-4 flex items-center text-sm text-gray-500">
                                <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {case_.quotes?.length || 0} quotes
                              </div>
                              <div className="ml-4 flex items-center text-sm text-gray-500">
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {new Date(case_.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <p className="text-sm text-gray-500">
                            {Array.isArray(case_.quotes) &&
                              case_.quotes.filter(
                                (q) => q.status === "accepted"
                              ).length > 0 && (
                                <span className="text-green-600 font-medium">
                                  Quote Accepted
                                </span>
                              )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {typedUser.role === "client" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Card hover>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Create New Case
                  </h3>
                  <p className="text-sm text-gray-500">
                    Post your legal issue and get quotes from qualified lawyers.
                  </p>
                  <div className="mt-3">
                    <Link to="/create-case">
                      <Button size="sm">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Review Quotes
                  </h3>
                  <p className="text-sm text-gray-500">
                    Compare quotes from lawyers and choose the best fit.
                  </p>
                  <div className="mt-3">
                    <Link to="/my-cases">
                      <Button variant="outline" size="sm">
                        View Cases
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          ""
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
