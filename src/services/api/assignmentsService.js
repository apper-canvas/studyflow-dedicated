const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const assignmentsService = {
  async getAll() {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "weight_c" } },
          { 
            field: { Name: "course_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [{ fieldName: "due_date_c", sorttype: "ASC" }]
      }
      
      const response = await apperClient.fetchRecords('assignment_c', params)
      
      if (!response.success) {
        console.error("Error fetching assignments:", response.message)
        throw new Error(response.message)
      }
      
      return (response.data || []).map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        courseId: assignment.course_id_c?.Id || null,
        dueDate: assignment.due_date_c || '',
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        description: assignment.description_c || '',
        grade: assignment.grade_c || null,
        weight: assignment.weight_c || 0
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error.response.data.message)
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
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "weight_c" } },
          { 
            field: { Name: "course_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      }
      
      const response = await apperClient.getRecordById('assignment_c', parseInt(id), params)
      
      if (!response.success) {
        console.error("Error fetching assignment:", response.message)
        throw new Error(response.message)
      }
      
      const assignment = response.data
      return {
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        courseId: assignment.course_id_c?.Id || null,
        dueDate: assignment.due_date_c || '',
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        description: assignment.description_c || '',
        grade: assignment.grade_c || null,
        weight: assignment.weight_c || 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignment:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async create(assignmentData) {
    try {
      await delay(400)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: assignmentData.title || assignmentData.name || '',
          title_c: assignmentData.title || '',
          due_date_c: assignmentData.dueDate || '',
          priority_c: assignmentData.priority || 'medium',
          status_c: assignmentData.status || 'pending',
          description_c: assignmentData.description || '',
          grade_c: assignmentData.grade ? parseInt(assignmentData.grade) : null,
          weight_c: assignmentData.weight ? parseInt(assignmentData.weight) : 0,
          course_id_c: assignmentData.courseId ? parseInt(assignmentData.courseId) : null
        }]
      }
      
      const response = await apperClient.createRecord('assignment_c', params)
      
      if (!response.success) {
        console.error("Error creating assignment:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to create assignment: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to create assignment")
        }
        
        const assignment = result.data
        return {
          Id: assignment.Id,
          title: assignment.title_c || assignment.Name || '',
          courseId: assignment.course_id_c || null,
          dueDate: assignment.due_date_c || '',
          priority: assignment.priority_c || 'medium',
          status: assignment.status_c || 'pending',
          description: assignment.description_c || '',
          grade: assignment.grade_c || null,
          weight: assignment.weight_c || 0
        }
      }
      
      throw new Error("No results returned from create operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async update(id, assignmentData) {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const updateData = { Id: parseInt(id) }
      if (assignmentData.title !== undefined) {
        updateData.Name = assignmentData.title
        updateData.title_c = assignmentData.title
      }
      if (assignmentData.dueDate !== undefined) updateData.due_date_c = assignmentData.dueDate
      if (assignmentData.priority !== undefined) updateData.priority_c = assignmentData.priority
      if (assignmentData.status !== undefined) updateData.status_c = assignmentData.status
      if (assignmentData.status_c !== undefined) updateData.status_c = assignmentData.status_c
      if (assignmentData.description !== undefined) updateData.description_c = assignmentData.description
      if (assignmentData.grade !== undefined) updateData.grade_c = assignmentData.grade ? parseInt(assignmentData.grade) : null
      if (assignmentData.weight !== undefined) updateData.weight_c = assignmentData.weight ? parseInt(assignmentData.weight) : 0
      if (assignmentData.courseId !== undefined) updateData.course_id_c = assignmentData.courseId ? parseInt(assignmentData.courseId) : null
      
      const params = { records: [updateData] }
      
      const response = await apperClient.updateRecord('assignment_c', params)
      
      if (!response.success) {
        console.error("Error updating assignment:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to update assignment: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to update assignment")
        }
        
        const assignment = result.data
        return {
          Id: assignment.Id,
          title: assignment.title_c || assignment.Name || '',
          courseId: assignment.course_id_c?.Id || assignment.course_id_c || null,
          dueDate: assignment.due_date_c || '',
          priority: assignment.priority_c || 'medium',
          status: assignment.status_c || 'pending',
          description: assignment.description_c || '',
          grade: assignment.grade_c || null,
          weight: assignment.weight_c || 0
        }
      }
      
      throw new Error("No results returned from update operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async delete(id) {
    try {
      await delay(250)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = { RecordIds: [parseInt(id)] }
      
      const response = await apperClient.deleteRecord('assignment_c', params)
      
      if (!response.success) {
        console.error("Error deleting assignment:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to delete assignment: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to delete assignment")
        }
        return { success: true, id: parseInt(id) }
      }
      
      throw new Error("No results returned from delete operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }
}