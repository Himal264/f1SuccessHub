const AppliedUniversity = ({ onClose }) => {
  // ... existing code ...

  return (
    <div className="bg-white rounded-lg shadow max-h-[80vh] overflow-y-auto">
      {/* ... header ... */}
      
      <div className="p-6">
        {applications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No applications found
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={application.university.logoUrl || "/placeholder-logo.png"}
                        alt={`${application.university.name} logo`}
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {application.university.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {application.programDetails.program} - {application.programDetails.studyLevel}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Applied by: {application.applicantInfo.name}</p>
                        <p>Email: {application.applicantInfo.email}</p>
                        <p>Role: {application.applicantInfo.role}</p>
                        <p>Date: {new Date(application.applicantInfo.applicationDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                </div>

                {application.comments && (
                  <div className="mt-3 text-sm text-gray-600 border-t pt-2">
                    <p className="font-medium">Comments:</p>
                    <p>{application.comments}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedUniversity;
