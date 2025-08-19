const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const gradeCategoriesService = {
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
          { field: { Name: "weight_c" } },
          { field: { Name: "grades_c" } },
          { 
            field: { Name: "course_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      }
      
      const response = await apperClient.fetchRecords('grade_category_c', params)
      
      if (!response.success) {
        console.error("Error fetching grade categories:", response.message)
        throw new Error(response.message)
      }
      
      return (response.data || []).map(category => ({
        Id: category.Id,
        name: category.Name || '',
        courseId: category.course_id_c?.Id || null,
        weight: category.weight_c || 0,
        grades: category.grades_c ? JSON.parse(category.grades_c) : []
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grade categories:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async getByCourseId(courseId) {
    try {
      await delay(250)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "grades_c" } },
          { 
            field: { Name: "course_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo", 
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      }
      
      const response = await apperClient.fetchRecords('grade_category_c', params)
      
      if (!response.success) {
        console.error("Error fetching grade categories by course:", response.message)
        throw new Error(response.message)
      }
      
      return (response.data || []).map(category => ({
        Id: category.Id,
        name: category.Name || '',
        courseId: category.course_id_c?.Id || null,
        weight: category.weight_c || 0,
        grades: category.grades_c ? JSON.parse(category.grades_c) : []
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grade categories by course:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async create(categoryData) {
    try {
      await delay(400)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: categoryData.name || '',
          weight_c: parseInt(categoryData.weight) || 0,
          grades_c: JSON.stringify(categoryData.grades || []),
          course_id_c: categoryData.courseId ? parseInt(categoryData.courseId) : null
        }]
      }
      
      const response = await apperClient.createRecord('grade_category_c', params)
      
      if (!response.success) {
        console.error("Error creating grade category:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to create grade category: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to create grade category")
        }
        
        const category = result.data
        return {
          Id: category.Id,
          name: category.Name || '',
          courseId: category.course_id_c || null,
          weight: category.weight_c || 0,
          grades: category.grades_c ? JSON.parse(category.grades_c) : []
        }
      }
      
      throw new Error("No results returned from create operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade category:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async update(id, categoryData) {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const updateData = { Id: parseInt(id) }
      if (categoryData.name !== undefined) updateData.Name = categoryData.name
      if (categoryData.weight !== undefined) updateData.weight_c = parseInt(categoryData.weight)
      if (categoryData.grades !== undefined) updateData.grades_c = JSON.stringify(categoryData.grades)
      if (categoryData.courseId !== undefined) updateData.course_id_c = categoryData.courseId ? parseInt(categoryData.courseId) : null
      
      const params = { records: [updateData] }
      
      const response = await apperClient.updateRecord('grade_category_c', params)
      
      if (!response.success) {
        console.error("Error updating grade category:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to update grade category: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to update grade category")
        }
        
        const category = result.data
        return {
          Id: category.Id,
          name: category.Name || '',
          courseId: category.course_id_c?.Id || category.course_id_c || null,
          weight: category.weight_c || 0,
          grades: category.grades_c ? JSON.parse(category.grades_c) : []
        }
      }
      
      throw new Error("No results returned from update operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade category:", error.response.data.message)
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
      
      const response = await apperClient.deleteRecord('grade_category_c', params)
      
      if (!response.success) {
        console.error("Error deleting grade category:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to delete grade category: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to delete grade category")
        }
        return { success: true, id: parseInt(id) }
      }
      
      throw new Error("No results returned from delete operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade category:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }
}