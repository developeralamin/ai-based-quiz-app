import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookOpenIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function BooksCreate({ auth }) {
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState('');
  const [coverError, setCoverError] = useState('');
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    author: '',
    description: '',
    file: null,
    cover: null,
  });

  const validatePDFFile = (file) => {
    setFileError('');

    // Check file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Please upload a valid PDF file');
      return false;
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('PDF file is too large. Maximum size is 100MB.');
      return false;
    }

    // Check minimum file size (PDFs should not be empty)
    if (file.size < 1024) {
      setFileError('PDF file appears to be empty or corrupted.');
      return false;
    }

    return true;
  };

  const validateCoverImage = (file) => {
    setCoverError('');

    // Check file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      setCoverError('Please upload a valid image file (PNG, JPG, GIF, or WebP)');
      return false;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setCoverError('Cover image is too large. Maximum size is 5MB.');
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validatePDFFile(file)) {
        setData('file', file);
      } else {
        setData('file', null);
      }
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validateCoverImage(file)) {
        setData('cover', file);
        // Preview cover image
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setData('cover', null);
        setPreview(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation before submit
    if (!data.file) {
      setFileError('PDF file is required');
      return;
    }

    if (!validatePDFFile(data.file)) {
      return;
    }

    post('/books', {
      forceFormData: true,
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Book</h2>}
    >
      <Head title="Add Book" />

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Back Link */}
              <Link
                href="/books"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Books
              </Link>

              <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload New Book</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Book Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Enter book title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border px-3 py-2"
                  />
                  {errors.title && <span className="text-red-600 text-sm mt-1">{errors.title}</span>}
                </div>

                {/* Author */}
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                    Author *
                  </label>
                  <input
                    id="author"
                    type="text"
                    value={data.author}
                    onChange={(e) => setData('author', e.target.value)}
                    placeholder="Enter author name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border px-3 py-2"
                  />
                  {errors.author && <span className="text-red-600 text-sm mt-1">{errors.author}</span>}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Enter book description (optional)"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border px-3 py-2"
                  />
                  {errors.description && <span className="text-red-600 text-sm mt-1">{errors.description}</span>}
                </div>

                {/* PDF File Upload */}
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                    PDF File *
                  </label>
                  {fileError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{fileError}</p>
                    </div>
                  )}
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file"
                            name="file"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF up to 100MB</p>
                      {data.file && <p className="text-sm text-green-600 mt-2">✓ {data.file.name}</p>}
                    </div>
                  </div>
                  {errors.file && <span className="text-red-600 text-sm mt-1 block">{errors.file}</span>}
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label htmlFor="cover" className="block text-sm font-medium text-gray-700">
                    Cover Image
                  </label>
                  {coverError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{coverError}</p>
                    </div>
                  )}
                  <div className="mt-4 flex gap-6">
                    <div className="flex-1">
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="cover"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                            >
                              <span>Upload cover</span>
                              <input
                                id="cover"
                                name="cover"
                                type="file"
                                accept="image/png,image/jpeg,image/gif,image/webp,.png,.jpg,.jpeg,.gif,.webp"
                                onChange={handleCoverChange}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 5MB</p>
                          {data.cover && <p className="text-sm text-green-600 mt-2">✓ {data.cover.name}</p>}
                        </div>
                      </div>
                      {errors.cover && <span className="text-red-600 text-sm mt-1 block">{errors.cover}</span>}
                    </div>

                    {/* Cover Preview */}
                    {preview && (
                      <div className="flex-shrink-0">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <img
                          src={preview}
                          alt="Cover preview"
                          className="h-40 w-32 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {processing ? 'Uploading...' : 'Upload Book'}
                  </button>
                  <Link
                    href="/books"
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
