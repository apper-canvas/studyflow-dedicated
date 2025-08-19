import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { attachmentService } from "@/services/api/attachmentService";
import { cn } from "@/utils/cn";

const FileAttachment = ({ 
  entityType, 
  entityId, 
  attachments = [], 
  onAttachmentChange,
  className = "" 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = {
    'application/pdf': { icon: 'FileText', color: 'text-red-500' },
    'application/msword': { icon: 'FileText', color: 'text-blue-500' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: 'FileText', color: 'text-blue-500' },
    'application/vnd.ms-excel': { icon: 'FileSpreadsheet', color: 'text-green-500' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: 'FileSpreadsheet', color: 'text-green-500' },
    'application/vnd.ms-powerpoint': { icon: 'Presentation', color: 'text-orange-500' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: 'Presentation', color: 'text-orange-500' },
    'text/plain': { icon: 'FileText', color: 'text-gray-500' },
    'image/jpeg': { icon: 'Image', color: 'text-purple-500' },
    'image/png': { icon: 'Image', color: 'text-purple-500' },
    'image/gif': { icon: 'Image', color: 'text-purple-500' }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    const fileInfo = allowedTypes[fileType] || { icon: 'File', color: 'text-gray-400' };
    return fileInfo;
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
    e.target.value = ''; // Reset input
  };

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = files.map(async (file) => {
      if (!allowedTypes[file.type]) {
        toast.error(`File type ${file.type} not supported`);
        return null;
      }

      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Simulate file upload
        const uploadResult = await attachmentService.uploadFile(
          file, 
          entityType, 
          entityId,
          (progress) => {
            setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
          }
        );

        // Create attachment record
        const attachmentData = {
          entityType,
          entityId: parseInt(entityId),
          fileName: uploadResult.fileName,
          fileType: uploadResult.fileType,
          fileSize: uploadResult.fileSize,
          fileUrl: uploadResult.fileUrl,
          description: `Attachment for ${entityType}`
        };

        const newAttachment = await attachmentService.create(attachmentData);
        
        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });

        toast.success(`${file.name} uploaded successfully`);
        return newAttachment;
      } catch (error) {
        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
        return null;
      }
    });

    const uploadedAttachments = (await Promise.all(uploadPromises)).filter(Boolean);
    setIsUploading(false);

    if (uploadedAttachments.length > 0 && onAttachmentChange) {
      onAttachmentChange([...attachments, ...uploadedAttachments]);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await attachmentService.delete(attachmentId);
      const updatedAttachments = attachments.filter(a => a.Id !== attachmentId);
      if (onAttachmentChange) {
        onAttachmentChange(updatedAttachments);
      }
      toast.success("Attachment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete attachment");
    }
  };

  const handleDownload = (attachment) => {
    // Simulate file download
    toast.info(`Downloading ${attachment.fileName}...`);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragOver
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <ApperIcon name="Upload" size={32} className="mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-medium text-gray-700 mb-1">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-gray-500">
          PDF, DOC, XLS, PPT, TXT, Images (Max 10MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={Object.keys(allowedTypes).join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {Object.entries(uploadProgress).map(([fileName, progress]) => (
          <motion.div
            key={fileName}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-gray-200 rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 truncate">
                {fileName}
              </span>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Attached Files */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Attachments ({attachments.length})
          </h4>
          <div className="space-y-2">
            {attachments.map((attachment) => {
              const fileInfo = getFileIcon(attachment.fileType);
              return (
                <motion.div
                  key={attachment.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <ApperIcon
                      name={fileInfo.icon}
                      size={20}
                      className={fileInfo.color}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {attachment.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(attachment)}
                      className="text-gray-500 hover:text-primary-600"
                    >
                      <ApperIcon name="Download" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAttachment(attachment.Id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileAttachment;