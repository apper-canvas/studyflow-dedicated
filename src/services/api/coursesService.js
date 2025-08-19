import coursesData from "@/services/mockData/courses.json";
import { attachmentService } from "./attachmentService";
import React from "react";
import Error from "@/components/ui/Error";

let courses = [...coursesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const coursesService = {
  async getAll() {
    await delay(300);
    return [...courses];
  },

  async getById(id) {
    await delay(200);
    const course = courses.find(c => c.Id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  },

async create(courseData) {
    await delay(400);
    const maxId = Math.max(...courses.map(c => c.Id), 0);
    const newCourse = {
      Id: maxId + 1,
      ...courseData,
      grade: 0
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  // Get attachments for course
  async getAttachments(courseId) {
    return await attachmentService.getByEntity('course', courseId);
  },

  // Add attachment to course
  async addAttachment(courseId, attachmentData) {
    const attachmentWithEntity = {
      ...attachmentData,
      entityType: 'course',
      entityId: parseInt(courseId)
    };
    return await attachmentService.create(attachmentWithEntity);
  },

// Remove attachment from course
  async removeAttachment(attachmentId) {
    return await attachmentService.delete(attachmentId);
  },

  async update(id, courseData) {
    await delay(300);
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    courses[index] = { ...courses[index], ...courseData };
    return { ...courses[index] };
  },

  async delete(id) {
    await delay(250);
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    const deleted = courses.splice(index, 1)[0];
    return { ...deleted };
  }
};