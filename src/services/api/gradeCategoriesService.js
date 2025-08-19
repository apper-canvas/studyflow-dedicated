import gradeCategoriesData from "@/services/mockData/gradeCategories.json";

let gradeCategories = [...gradeCategoriesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeCategoriesService = {
  async getAll() {
    await delay(300);
    return [...gradeCategories];
  },

  async getByCourseId(courseId) {
    await delay(250);
    return gradeCategories.filter(gc => gc.courseId === parseInt(courseId)).map(gc => ({ ...gc }));
  },

  async create(categoryData) {
    await delay(400);
    const maxId = Math.max(...gradeCategories.map(gc => gc.Id), 0);
    const newCategory = {
      Id: maxId + 1,
      ...categoryData,
      grades: categoryData.grades || []
    };
    gradeCategories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay(300);
    const index = gradeCategories.findIndex(gc => gc.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade category not found");
    }
    gradeCategories[index] = { ...gradeCategories[index], ...categoryData };
    return { ...gradeCategories[index] };
  },

  async delete(id) {
    await delay(250);
    const index = gradeCategories.findIndex(gc => gc.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade category not found");
    }
    const deleted = gradeCategories.splice(index, 1)[0];
    return { ...deleted };
  }
};