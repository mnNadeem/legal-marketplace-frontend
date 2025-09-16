import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Upload, X, FileText } from "lucide-react";
import { useDropzone } from "react-dropzone";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import { casesApi } from "../services/api";
import toast from "react-hot-toast";

interface CreateCaseFormData {
  title: string;
  category: string;
  description: string;
}

const CreateCasePage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCaseFormData>();

  const createCaseMutation = useMutation({
    mutationFn: casesApi.create,
    onSuccess: (response) => {
      toast.success("Case created successfully!");
      navigate(`/cases/${response.data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create case");
    },
  });

  const uploadFilesMutation = useMutation({
    mutationFn: ({ caseId, files }: { caseId: string; files: FileList }) =>
      casesApi.uploadFiles(caseId, files),
    onSuccess: () => {
      toast.success("Files uploaded successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload files");
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => {
        const validTypes = [
          "application/pdf",
          "image/png",
          "image/jpeg",
          "image/jpg",
        ];
        const maxSize = 10 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
          toast.error(
            `${file.name} is not a valid file type. Only PDF, PNG, and JPEG files are allowed.`
          );
          return false;
        }

        if (file.size > maxSize) {
          toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
          return false;
        }

        return true;
      });

      setFiles((prev) => {
        const remaining = 10 - prev.length;
        if (remaining <= 0) {
          toast.error("You can upload a maximum of 10 files.");
          return prev;
        }
        if (validFiles.length > remaining) {
          toast.error(
            `You can only add ${remaining} more file${remaining === 1 ? "" : "s"}.`
          );
        }
        const nextBatch = validFiles.slice(0, Math.max(0, remaining));
        return [...prev, ...nextBatch];
      });
    },
    onDropRejected: (fileRejections) => {
      const hasTooMany = fileRejections.some((rej) =>
        rej.errors.some((e) => e.code === 'too-many-files')
      );
      if (hasTooMany) {
        toast.error('You can upload a maximum of 10 files.');
        return;
      }

      const messages = new Set<string>();
      for (const rej of fileRejections) {
        for (const err of rej.errors) {
          if (err.code === 'file-too-large') {
            messages.add(`${rej.file.name} is too large. Maximum file size is 10MB.`);
          } else if (err.code === 'file-invalid-type') {
            messages.add(`${rej.file.name} is not a valid file type. Only PDF, PNG, and JPEG files are allowed.`);
          } else if (err.message) {
            messages.add(err.message);
          }
        }
      }
      if (messages.size > 0) {
        toast.error(Array.from(messages).join('\n'));
      }
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const categoryOptions = [
    { value: "", label: "Select a category" },
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

  const onSubmit = async (data: CreateCaseFormData) => {
    try {
      const response = await createCaseMutation.mutateAsync(data);

      if (files.length > 0) {
        const fileList = files.reduce((acc, file, index) => {
          acc[index] = file;
          return acc;
        }, {} as any);

        const filesFileList = Object.values(fileList) as File[];
        const dataTransfer = new DataTransfer();
        filesFileList.forEach((file) => dataTransfer.items.add(file));

        await uploadFilesMutation.mutateAsync({
          caseId: response.data.id,
          files: dataTransfer.files,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Case</h1>
          <p className="mt-2 text-gray-600">
            Describe your legal issue and upload relevant documents. Lawyers
            will review your case and submit quotes.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Case Information
            </h2>

            <div className="space-y-6">
              <Input
                label="Case Title"
                placeholder="Brief title for your legal issue"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 10,
                    message: "Title must be at least 10 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Title must be less than 100 characters",
                  },
                })}
                error={errors.title?.message}
              />

              <Select
                label="Category"
                placeholder="Select a category"
                options={categoryOptions}
                {...register("category", {
                  required: "Category is required",
                })}
                error={errors.category?.message}
              />

              <Textarea
                label="Description"
                placeholder="Provide a detailed description of your legal issue. Include relevant facts, timeline, and any specific questions you have."
                rows={8}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 50,
                    message: "Description must be at least 50 characters",
                  },
                  maxLength: {
                    value: 5000,
                    message: "Description must be less than 5000 characters",
                  },
                })}
                error={errors.description?.message}
                helperText="Be as detailed as possible to help lawyers understand your case and provide accurate quotes."
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Documents (Optional)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload relevant documents to help lawyers better understand your
              case. Maximum 10 files, 10MB each. Supported formats: PDF, PNG,
              JPEG.
            </p>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary-400 bg-primary-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? "Drop the files here..."
                    : "Drag & drop files here, or click to select files"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, PNG, JPEG up to 10MB each
                </p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Uploaded Files ({files.length}/10)
                </h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={
                isSubmitting ||
                createCaseMutation.isPending ||
                uploadFilesMutation.isPending
              }
              disabled={
                isSubmitting ||
                createCaseMutation.isPending ||
                uploadFilesMutation.isPending
              }
            >
              Create Case
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateCasePage;
