const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const attachmentService = {
  async getAll() {
    try {
      await delay(200)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "entity_type_c" } },
          { field: { Name: "entity_id_c" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "file_type_c" } },
          { field: { Name: "file_size_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "uploaded_at_c" } },
          { field: { Name: "description_c" } }
        ],
        orderBy: [{ fieldName: "uploaded_at_c", sorttype: "DESC" }]
      }
      
      const response = await apperClient.fetchRecords('attachment_c', params)
      
      if (!response.success) {
        console.error("Error fetching attachments:", response.message)
        throw new Error(response.message)
      }
      
      return (response.data || []).map(attachment => ({
        Id: attachment.Id,
        entityType: attachment.entity_type_c || '',
        entityId: attachment.entity_id_c ? parseInt(attachment.entity_id_c) : null,
        fileName: attachment.file_name_c || attachment.Name || '',
        fileType: attachment.file_type_c || '',
        fileSize: attachment.file_size_c || 0,
        fileUrl: attachment.file_url_c || '',
        uploadedAt: attachment.uploaded_at_c || '',
        description: attachment.description_c || ''
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attachments:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async getById(id) {
    try {
      await delay(200)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "entity_type_c" } },
          { field: { Name: "entity_id_c" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "file_type_c" } },
          { field: { Name: "file_size_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "uploaded_at_c" } },
          { field: { Name: "description_c" } }
        ]
      }
      
      const response = await apperClient.getRecordById('attachment_c', parseInt(id), params)
      
      if (!response.success) {
        console.error("Error fetching attachment:", response.message)
        throw new Error(response.message)
      }
      
      const attachment = response.data
      return {
        Id: attachment.Id,
        entityType: attachment.entity_type_c || '',
        entityId: attachment.entity_id_c ? parseInt(attachment.entity_id_c) : null,
        fileName: attachment.file_name_c || attachment.Name || '',
        fileType: attachment.file_type_c || '',
        fileSize: attachment.file_size_c || 0,
        fileUrl: attachment.file_url_c || '',
        uploadedAt: attachment.uploaded_at_c || '',
        description: attachment.description_c || ''
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attachment:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async getByEntity(entityType, entityId) {
    try {
      await delay(200)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "entity_type_c" } },
          { field: { Name: "entity_id_c" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "file_type_c" } },
          { field: { Name: "file_size_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "uploaded_at_c" } },
          { field: { Name: "description_c" } }
        ],
        where: [
          {
            FieldName: "entity_type_c",
            Operator: "EqualTo",
            Values: [entityType]
          },
          {
            FieldName: "entity_id_c", 
            Operator: "EqualTo",
            Values: [entityId.toString()]
          }
        ],
        orderBy: [{ fieldName: "uploaded_at_c", sorttype: "DESC" }]
      }
      
      const response = await apperClient.fetchRecords('attachment_c', params)
      
      if (!response.success) {
        console.error("Error fetching attachments by entity:", response.message)
        throw new Error(response.message)
      }
      
      return (response.data || []).map(attachment => ({
        Id: attachment.Id,
        entityType: attachment.entity_type_c || '',
        entityId: attachment.entity_id_c ? parseInt(attachment.entity_id_c) : null,
        fileName: attachment.file_name_c || attachment.Name || '',
        fileType: attachment.file_type_c || '',
        fileSize: attachment.file_size_c || 0,
        fileUrl: attachment.file_url_c || '',
        uploadedAt: attachment.uploaded_at_c || '',
        description: attachment.description_c || ''
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attachments by entity:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async create(attachmentData) {
    try {
      await delay(400)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: attachmentData.fileName || '',
          entity_type_c: attachmentData.entityType || '',
          entity_id_c: attachmentData.entityId ? attachmentData.entityId.toString() : '',
          file_name_c: attachmentData.fileName || '',
          file_type_c: attachmentData.fileType || '',
          file_size_c: parseInt(attachmentData.fileSize) || 0,
          file_url_c: attachmentData.fileUrl || '',
          uploaded_at_c: new Date().toISOString(),
          description_c: attachmentData.description || ''
        }]
      }
      
      const response = await apperClient.createRecord('attachment_c', params)
      
      if (!response.success) {
        console.error("Error creating attachment:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to create attachment: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to create attachment")
        }
        
        const attachment = result.data
        return {
          Id: attachment.Id,
          entityType: attachment.entity_type_c || '',
          entityId: attachment.entity_id_c ? parseInt(attachment.entity_id_c) : null,
          fileName: attachment.file_name_c || attachment.Name || '',
          fileType: attachment.file_type_c || '',
          fileSize: attachment.file_size_c || 0,
          fileUrl: attachment.file_url_c || '',
          uploadedAt: attachment.uploaded_at_c || '',
          description: attachment.description_c || ''
        }
      }
      
      throw new Error("No results returned from create operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attachment:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async update(id, attachmentData) {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const updateData = { Id: parseInt(id) }
      if (attachmentData.fileName !== undefined) {
        updateData.Name = attachmentData.fileName
        updateData.file_name_c = attachmentData.fileName
      }
      if (attachmentData.entityType !== undefined) updateData.entity_type_c = attachmentData.entityType
      if (attachmentData.entityId !== undefined) updateData.entity_id_c = attachmentData.entityId.toString()
      if (attachmentData.fileType !== undefined) updateData.file_type_c = attachmentData.fileType
      if (attachmentData.fileSize !== undefined) updateData.file_size_c = parseInt(attachmentData.fileSize)
      if (attachmentData.fileUrl !== undefined) updateData.file_url_c = attachmentData.fileUrl
      if (attachmentData.description !== undefined) updateData.description_c = attachmentData.description
      
      const params = { records: [updateData] }
      
      const response = await apperClient.updateRecord('attachment_c', params)
      
      if (!response.success) {
        console.error("Error updating attachment:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to update attachment: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to update attachment")
        }
        
        const attachment = result.data
        return {
          Id: attachment.Id,
          entityType: attachment.entity_type_c || '',
          entityId: attachment.entity_id_c ? parseInt(attachment.entity_id_c) : null,
          fileName: attachment.file_name_c || attachment.Name || '',
          fileType: attachment.file_type_c || '',
          fileSize: attachment.file_size_c || 0,
          fileUrl: attachment.file_url_c || '',
          uploadedAt: attachment.uploaded_at_c || '',
          description: attachment.description_c || ''
        }
      }
      
      throw new Error("No results returned from update operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attachment:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async delete(id) {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = { RecordIds: [parseInt(id)] }
      
      const response = await apperClient.deleteRecord('attachment_c', params)
      
      if (!response.success) {
        console.error("Error deleting attachment:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to delete attachment: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to delete attachment")
        }
        return { success: true, id: parseInt(id) }
      }
      
      throw new Error("No results returned from delete operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attachment:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async uploadFile(file, entityType, entityId, onProgress = null) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"))
        return
      }

      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        reject(new Error("File size too large. Maximum 10MB allowed."))
        return
      }

      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress > 100) progress = 100
        
        if (onProgress) {
          onProgress(Math.round(progress))
        }

        if (progress >= 100) {
          clearInterval(interval)
          resolve({
            success: true,
            fileUrl: `uploads/${entityType}/${entityId}/${file.name}`,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
          })
        }
      }, 100)
    })
  }
}

export { attachmentService }