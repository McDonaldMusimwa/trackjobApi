import express from 'express';
import userController from '../controllers/userController.js';
import jobController from '../controllers/jobController.js';
import applicationController from '../controllers/applicationController.js';
import interviewController from '../controllers/interviewController.js';
import noteController from '../controllers/noteController.js';
import documentController from '../controllers/documents.js';
const junctionRouter = express.Router();
// Health check
junctionRouter.get("/", (req, res) => {
    res.status(200).json({ message: "successful", data: "Server up and running" });
});
// ==================== USER ROUTES ====================
junctionRouter.post("/users/ensure", userController.ensureUser); // Find or create user
junctionRouter.get("/users", userController.getUsers);
junctionRouter.get("/users/:id", userController.getUserById);
junctionRouter.post("/users", userController.createUser);
junctionRouter.put("/users/:id", userController.updateUser);
junctionRouter.delete("/users/:id", userController.deleteUser);
// User Profile Routes
junctionRouter.get("/users/:id/profile", userController.getUserProfile);
junctionRouter.post("/users/:userId/profile", userController.createOrUpdateUserProfile);
// ==================== JOB ROUTES ====================
junctionRouter.get("/jobs", jobController.getJobs);
junctionRouter.get("/jobs/:id", jobController.getJobById);
junctionRouter.get("/jobs/author/:authorId", jobController.getJobsByAuthor);
junctionRouter.post("/jobs", jobController.createJob);
junctionRouter.put("/jobs/:id", jobController.updateJob);
junctionRouter.delete("/jobs/:id", jobController.deleteJob);
// ==================== APPLICATION ROUTES ====================
junctionRouter.get("/applications", applicationController.getApplications);
junctionRouter.get("/applications/:id", applicationController.getApplicationById);
junctionRouter.get("/applications/user/:userId", applicationController.getApplicationsByUser);
junctionRouter.get("/applications/job/:jobId", applicationController.getApplicationsByJob);
junctionRouter.post("/applications", applicationController.createApplication);
junctionRouter.put("/applications/:id", applicationController.updateApplication);
junctionRouter.delete("/applications/:id", applicationController.deleteApplication);
// ==================== INTERVIEW ROUTES ====================
junctionRouter.get("/interviews", interviewController.getInterviews);
junctionRouter.get("/interviews/:id", interviewController.getInterviewById);
junctionRouter.get("/interviews/user/:userId", interviewController.getInterviewsByUser);
junctionRouter.get("/interviews/job/:jobId", interviewController.getInterviewsByJob);
junctionRouter.post("/interviews", interviewController.createInterview);
junctionRouter.put("/interviews/:id", interviewController.updateInterview);
junctionRouter.delete("/interviews/:id", interviewController.deleteInterview);
// ==================== NOTE ROUTES ====================
junctionRouter.get("/notes", noteController.getNotes);
junctionRouter.get("/notes/:id", noteController.getNoteById);
junctionRouter.get("/notes/user/:userId", noteController.getNotesByUser);
junctionRouter.get("/notes/job/:jobId", noteController.getNotesByJob);
junctionRouter.post("/notes", noteController.createNote);
junctionRouter.put("/notes/:id", noteController.updateNote);
junctionRouter.delete("/notes/:id", noteController.deleteNote);
// ==================== DOCUMENT ROUTES ====================
junctionRouter.post("/documents/upload-url", documentController.getUploadUrl); // Get presigned URL for upload
junctionRouter.post("/documents/confirm", documentController.confirmUpload); // Confirm upload and save metadata
junctionRouter.get("/documents/:userId", documentController.getDocuments); // Get user's documents
junctionRouter.get("/documents/download/:id", documentController.getDownloadUrl); // Get presigned URL for download
junctionRouter.delete("/documents/:id", documentController.deleteDocument); // Delete document
export default junctionRouter;
