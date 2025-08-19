const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const coursesService = {
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
          { field: { Name: "professor_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      }
      
      const response = await apperClient.fetchRecords('course_c', params)
      
      if (!response.success) {
        console.error("Error fetching courses:", response.message)
        throw new Error(response.message)
      }
      
      return (response.data || []).map(course => ({
        Id: course.Id,
        name: course.Name || '',
        professor: course.professor_c || '',
        room: course.room_c || '',
        schedule: course.schedule_c ? JSON.parse(course.schedule_c) : [],
        color: course.color_c || '#4F46E5',
        credits: course.credits_c || 0,
        semester: course.semester_c || '',
        grade: course.grade_c || 0
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error.response.data.message)
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
          { field: { Name: "professor_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "grade_c" } }
        ]
      }
      
      const response = await apperClient.getRecordById('course_c', parseInt(id), params)
      
      if (!response.success) {
        console.error("Error fetching course:", response.message)
        throw new Error(response.message)
      }
      
      const course = response.data
      return {
        Id: course.Id,
        name: course.Name || '',
        professor: course.professor_c || '',
        room: course.room_c || '',
        schedule: course.schedule_c ? JSON.parse(course.schedule_c) : [],
        color: course.color_c || '#4F46E5',
        credits: course.credits_c || 0,
        semester: course.semester_c || '',
        grade: course.grade_c || 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching course:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async create(courseData) {
    try {
      await delay(400)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: courseData.name || '',
          professor_c: courseData.professor || '',
          room_c: courseData.room || '',
          schedule_c: JSON.stringify(courseData.schedule || []),
          color_c: courseData.color || '#4F46E5',
          credits_c: parseInt(courseData.credits) || 0,
          semester_c: courseData.semester || '',
          grade_c: parseFloat(courseData.grade) || 0
        }]
      }
      
      const response = await apperClient.createRecord('course_c', params)
      
      if (!response.success) {
        console.error("Error creating course:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to create course: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to create course")
        }
        
        const course = result.data
        return {
          Id: course.Id,
          name: course.Name || '',
          professor: course.professor_c || '',
          room: course.room_c || '',
          schedule: course.schedule_c ? JSON.parse(course.schedule_c) : [],
          color: course.color_c || '#4F46E5',
          credits: course.credits_c || 0,
          semester: course.semester_c || '',
          grade: course.grade_c || 0
        }
      }
      
      throw new Error("No results returned from create operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  async update(id, courseData) {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const updateData = { Id: parseInt(id) }
      if (courseData.name !== undefined) updateData.Name = courseData.name
      if (courseData.professor !== undefined) updateData.professor_c = courseData.professor
      if (courseData.room !== undefined) updateData.room_c = courseData.room
      if (courseData.schedule !== undefined) updateData.schedule_c = JSON.stringify(courseData.schedule)
      if (courseData.color !== undefined) updateData.color_c = courseData.color
      if (courseData.credits !== undefined) updateData.credits_c = parseInt(courseData.credits)
      if (courseData.semester !== undefined) updateData.semester_c = courseData.semester
      if (courseData.grade !== undefined) updateData.grade_c = parseFloat(courseData.grade)
      
      const params = { records: [updateData] }
      
      const response = await apperClient.updateRecord('course_c', params)
      
      if (!response.success) {
        console.error("Error updating course:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to update course: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to update course")
        }
        
        const course = result.data
        return {
          Id: course.Id,
          name: course.Name || '',
          professor: course.professor_c || '',
          room: course.room_c || '',
          schedule: course.schedule_c ? JSON.parse(course.schedule_c) : [],
          color: course.color_c || '#4F46E5',
          credits: course.credits_c || 0,
          semester: course.semester_c || '',
          grade: course.grade_c || 0
        }
      }
      
      throw new Error("No results returned from update operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error.response.data.message)
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
      
      const response = await apperClient.deleteRecord('course_c', params)
      
      if (!response.success) {
        console.error("Error deleting course:", response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          console.error(`Failed to delete course: ${JSON.stringify([result])}`)
          throw new Error(result.message || "Failed to delete course")
        }
        return { success: true, id: parseInt(id) }
      }
      
      throw new Error("No results returned from delete operation")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error.response.data.message)
        throw new Error(error.response.data.message)
      }
      throw error
    }
  }
}