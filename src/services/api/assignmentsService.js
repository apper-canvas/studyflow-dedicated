import assignmentsData from "@/services/mockData/assignments.json";
import { attachmentService } from "./attachmentService";

let assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentsService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async getByCourseId(courseId) {
    await delay(250);
    return assignments.filter(a => a.courseId === parseInt(courseId)).map(a => ({ ...a }));
  },

async create(assignmentData) {
    await delay(400);
    const maxId = Math.max(...assignments.map(a => a.Id), 0);
    const newAssignment = {
      Id: maxId + 1,
      ...assignmentData,
      status: assignmentData.status || "pending",
      grade: null
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  // Get attachments for assignment
  async getAttachments(assignmentId) {
    return await attachmentService.getByEntity('assignment', assignmentId);
  },

  // Add attachment to assignment
  async addAttachment(assignmentId, attachmentData) {
    const attachmentWithEntity = {
      ...attachmentData,
      entityType: 'assignment',
      entityId: parseInt(assignmentId)
    };
    return await attachmentService.create(attachmentWithEntity);
  },

  // Remove attachment from assignment
  async removeAttachment(attachmentId) {
    return await attachmentService.delete(attachmentId);
  },

async update(id, assignmentData) {
    await delay(300);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments[index] = { ...assignments[index], ...assignmentData };
    return { ...assignments[index] };
  },

  async delete(id) {
    await delay(250);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    const deleted = assignments.splice(index, 1)[0];
    return { ...deleted };
  }
};