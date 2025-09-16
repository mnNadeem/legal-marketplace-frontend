import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { casesApi } from '../services/api';
import { extractList, extractTotal } from '../utils/apiHelpers';
import { Case } from '../types';
import { Clock, CheckCircle, XCircle, FileText, DollarSign } from 'lucide-react';

const MyCasesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['myCases', page, limit],
    queryFn: () => casesApi.getAll({ page, limit }),
  });

  const raw = data?.data;
  const cases: Case[] = extractList<Case>(raw);
  const total = extractTotal(raw, cases);
  const totalPages = Math.ceil(total / limit) || 1;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'engaged':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'closed':
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'engaged':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Cases
            </h2>
            <p className="mt-1 text-sm text-gray-500">View and manage your cases.</p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link to="/create-case">
              <Button>Create New Case</Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : cases.length === 0 ? (
          <Card className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cases yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first legal case.
            </p>
            <div className="mt-6">
              <Link to="/create-case">
                <Button>Create Case</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {cases.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/cases/${c.id}`}
                    className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getStatusIcon(c.status)}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary-600 truncate">
                              {c.title}
                            </p>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                              {c.status}
                            </span>
                          </div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="truncate">{c.category}</span>
                            </div>
                            <div className="ml-4 flex items-center text-sm text-gray-500">
                              <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {c.quotes?.length || 0} quotes
                            </div>
                            <div className="ml-4 flex items-center text-sm text-gray-500">
                              <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {new Date(c.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyCasesPage;

