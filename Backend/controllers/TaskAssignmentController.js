const TaskAssignment = require("../models/taskAssignmentModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

const assignTask = async (req, res) => {
    try {

        const { task_ID, assignedTo } = req.body;

        const task = await Task.findById(task_ID);

        if (!task) {
            return res.status(404).send({
                success: false,
                msg: "Task not found"
            });
        }

        const user = await User.findById(assignedTo);

        if (!user) {
            return res.status(404).send({
                success: false,
                msg: "User not found"
            });
        }

        const assignment = await TaskAssignment.create({
            task_ID,
            assignedTo,
            assignedBy: req.user.id
        });

        res.status(201).send({
            success: true,
            msg: "Task Assigned Successfully",
            assignment
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};

module.exports = { assignTask };