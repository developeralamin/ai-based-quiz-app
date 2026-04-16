import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeftIcon, ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';

export default function BooksShow({ auth, book }) {
  const [scale, setScale] = useState(100);

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-viewer');
    iframe.contentWindow.print();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = book.file_url;
    link.download = `${book.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Read Book</h2>}
    >
      <Head title={`Read: ${book.title}`} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header with controls */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4">
            <div className="p-4 text-gray-900">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-2"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back to Books
                  </Link>
                  <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
                  <p className="text-gray-600 mt-1">by {book.author}</p>
                  {book.description && (
                    <p className="text-gray-700 mt-2">{book.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                    title="Print PDF"
                  >
                    <PrinterIcon className="h-5 w-5" />
                    <span className="text-sm">Print</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors flex items-center gap-2"
                    title="Download PDF"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-4 border-t pt-4">
                <label className="text-sm text-gray-700">Zoom:</label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                  className="w-40"
                />
                <span className="text-sm text-gray-600 w-12 text-right">{scale}%</span>
              </div>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-4">
              <iframe
                id="pdf-viewer"
                src={`${book.file_url}#toolbar=1&navpanes=0&scrollbar=1&zoom=${scale}`}
                className="w-full border border-gray-300 rounded-lg"
                style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}
                title={book.title}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Use the toolbar in the PDF viewer to navigate, search, and zoom. You can also download or print the PDF using the buttons above.
            </p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
