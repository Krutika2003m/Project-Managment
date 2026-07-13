const TaskAssignment = require("../models/taskAssignmentModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

const assignTask = async (req, res) => {
    try {

        const { task_ID, assignedTo } = req.body;

        // Check if task exists
        const task = await Task.findById(task_ID);

        if (!task) {
            return res.status(404).send({
                success: false,
                msg: "Task not found"
            });
        }

        // Check if user exists
        const user = await User.findById(assignedTo);

        if (!user) {
            return res.status(404).send({
                success: false,
                msg: "User not found"
            });
        }

        // Create assignment
        const assignment = await TaskAssignment.create({
            task_id: task_ID,
            user_id: assignedTo,
            assignBy: req.user.id
        });

        return res.status(201).send({
            success: true,
            msg: "Task Assigned Successfully",
            assignment
        });

    } catch (error) {
        console.error(error);

        return res.status(500).send({
            success: false,
            msg: "Server Error",
            error: error.message
        });
    }
};

const assignMultipleUsers = async (req, res) => {
    try {
        const { task_ID, userIds } = req.body;

        // Check task
        const task = await Task.findById(task_ID);

        if (!task) {
            return res.status(404).send({
                success: false,
                msg: "Task not found"
            });
        }

        const assignments = [];
        const skippedUsers = [];

        for (const userId of userIds) {

            // Check user
            const user = await User.findById(userId);

            if (!user) {
                skippedUsers.push({
                    userId,
                    reason: "User not found"
                });
                continue;
            }

            // Check if already assigned
            const alreadyAssigned = await TaskAssignment.findOne({
                task_id: task_ID,
                user_id: userId
            });

            if (alreadyAssigned) {
                skippedUsers.push({
                    userId,
                    reason: "Task already assigned"
                });
                continue;
            }

            // Assign task
            const assignment = await TaskAssignment.create({
                task_id: task_ID,
                user_id: userId,
                assignBy: req.user.id
            });

            assignments.push(assignment);
        }

        return res.status(201).send({
            success: true,
            msg: "Task assigned successfully",
            assignedCount: assignments.length,
            assignments,
            skippedUsers
        });

    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};

const assignMultipleTasks = async (req, res) => {
    try {
        const { user_ID, taskIds } = req.body;

        // Check user
        const user = await User.findById(user_ID);

        if (!user) {
            return res.status(404).send({
                success: false,
                msg: "User not found"
            });
        }

        const assignments = [];
        const skippedTasks = [];

        for (const taskId of taskIds) {

            // Check task
            const task = await Task.findById(taskId);

            if (!task) {
                skippedTasks.push({
                    taskId,
                    reason: "Task not found"
                });
                continue;
            }

            // Check if already assigned
            const existingAssignment = await TaskAssignment.findOne({
                task_id: taskId,
                user_id: user_ID
            });

            if (existingAssignment) {
                skippedTasks.push({
                    taskId,
                    reason: "Task already assigned"
                });
                continue;
            }

            // Assign task
            const assignment = await TaskAssignment.create({
                task_id: taskId,
                user_id: user_ID,
                assignBy: req.user.id
            });

            assignments.push(assignment);
        }

        return res.status(201).send({
            success: true,
            msg: "Multiple tasks assigned successfully",
            assignedCount: assignments.length,
            assignments,
            skippedTasks
        });

    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};

const getAllAssignments = async (req, res) => {
    try {

        const assignments = await TaskAssignment.find()
            .populate("task_id")
            .populate("user_id")
            .populate("assignBy");

        return res.status(200).send({
            success: true,
            count: assignments.length,
            assignments
        });

    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};

const getAssignmentById = async (req, res) => {
    try {

        const { ID } = req.params;

        const assignment = await TaskAssignment.findById(ID)
            .populate("task_id")
            .populate("user_id")
            .populate("assignBy");

        if (!assignment) {
            return res.status(404).send({
                success: false,
                msg: "Assignment not found"
            });
        }

        return res.status(200).send({
            success: true,
            assignment
        });

    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};

const getAssignmentCount = async (req, res) => {
    try {

        const totalAssignments = await TaskAssignment.countDocuments();

        const assigned = await TaskAssignment.countDocuments({
            status: "Assigned"
        });

        const accepted = await TaskAssignment.countDocuments({
            status: "Accepted"
        });

        const rejected = await TaskAssignment.countDocuments({
            status: "Rejected"
        });

        const completed = await TaskAssignment.countDocuments({
            status: "Completed"
        });

        return res.status(200).send({
            success: true,
            data: {
                totalAssignments,
                assigned,
                accepted,
                rejected,
                completed
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};

const assignmentDashboard = async (req, res) => {
    try {

        const totalAssignments = await TaskAssignment.countDocuments();

        const assigned = await TaskAssignment.countDocuments({
            status: "Assigned"
        });

        const accepted = await TaskAssignment.countDocuments({
            status: "Accepted"
        });

        const rejected = await TaskAssignment.countDocuments({
            status: "Rejected"
        });

        const completed = await TaskAssignment.countDocuments({
            status: "Completed"
        });

        const totalUsers = await User.countDocuments();

        const totalTasks = await Task.countDocuments();

        return res.status(200).send({
            success: true,
            dashboard: {
                totalUsers,
                totalTasks,
                totalAssignments,
                assigned,
                accepted,
                rejected,
                completed
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};

module.exports = { 
    assignTask,
    assignMultipleUsers,
    assignMultipleTasks,
    getAllAssignments,
    getAssignmentById,
    getAssignmentCount,
    assignmentDashboard
 };