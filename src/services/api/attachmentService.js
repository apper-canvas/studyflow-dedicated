import attachmentsData from "@/services/mockData/attachments.json";

let attachments = [...attachmentsData];

// Simulate API delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const attachmentService = {
  // Get all attachments
  async getAll() {
    await delay(200);
    return attachments.map(attachment => ({ ...attachment }));
  },

  // Get attachment by ID
  async getById(id) {
    await delay(200);
    const attachment = attachments.find(a => a.Id === parseInt(id));
    if (!attachment) {
      throw new Error("Attachment not found");
    }
    return { ...attachment };
  },

  // Get attachments by entity (assignment or course)
  async getByEntity(entityType, entityId) {
    await delay(200);
    return attachments
      .filter(a => a.entityType === entityType && a.entityId === parseInt(entityId))
      .map(attachment => ({ ...attachment }));
  },

  // Create new attachment
  async create(attachmentData) {
    await delay(400);
    const maxId = Math.max(...attachments.map(a => a.Id), 0);
    const newAttachment = {
      Id: maxId + 1,
      ...attachmentData,
      uploadedAt: new Date().toISOString(),
      size: attachmentData.size || 0
    };
    attachments.push(newAttachment);
    return { ...newAttachment };
  },

  // Update attachment
  async update(id, attachmentData) {
    await delay(300);
    const index = attachments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attachment not found");
    }
    attachments[index] = { ...attachments[index], ...attachmentData };
    return { ...attachments[index] };
  },

  // Delete attachment
  async delete(id) {
    await delay(300);
    const index = attachments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attachment not found");
    }
    const deleted = attachments.splice(index, 1)[0];
    return { ...deleted };
  },

  // Upload file (simulated)
  async uploadFile(file, entityType, entityId, onProgress = null) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"));
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error("File size too large. Maximum 10MB allowed."));
        return;
      }

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        
        if (onProgress) {
          onProgress(Math.round(progress));
        }

        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            success: true,
            fileUrl: `uploads/${entityType}/${entityId}/${file.name}`,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
          });
        }
      }, 100);
    });
  }
};

export { attachmentService };