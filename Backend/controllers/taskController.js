const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

async function createTask(req, res) {
    try {
        const {
            project_ID,
            title,
            description,
            startDate,
            endDate
        } = req.body;

        const project = await Project.findById(project_ID);

        if (!project) {
            return res.status(404).send({
                success: false,
                msg: "Project not found"
            });
        }

        const docPath = req.file ? req.file.filename : "";

        const newTask = await Task.create({
            project_ID,
            title,
            description,
            startDate,
            endDate,
            createdBy: req.user.id,
            docPath
        });

        res.status(201).send({
            success: true,
            msg: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        console.log(error.message);
         res.status(500).send({   success: false,    msg: "Server Error"
        });
    }}


const getAllTasks = async (req, res) => {
    try {

        const tasks = await Task.find()
            .populate("project_ID", "title department")
            .populate("createdBy", "name email role");

        res.status(200).send({
            success: true,
            totalTasks: tasks.length,
            tasks
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { ID } = req.params;

        const task = await Task.findById(ID)
            .populate("project_ID", "title department")
            .populate("createdBy", "name email role");

        if (!task) {
            return res.status(404).send({
                success: false,
                msg: "Task not found"
            });
        }

        res.status(200).send({
            success: true,
            task
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};

const updateTask = async (req, res) => {
    try {

        const { ID } = req.params;

        const task = await Task.findById(ID);

        if (!task) {
            return res.status(404).send({
                success: false,
                msg: "Task not found"
            });
        }

        const {
            project_ID,
            title,
            description,
            startDate,
            endDate,
            status
        } = req.body;

        // Update only provided fields
        if (project_ID) task.project_ID = project_ID;
        if (title) task.title = title;
        if (description) task.description = description;
        if (startDate) task.startDate = startDate;
        if (endDate) task.endDate = endDate;
        if (status) task.status = status;

        // Update document if uploaded
        if (req.file) {
            task.docPath = req.file.filename;
        }

        await task.save();

        res.status(200).send({
            success: true,
            msg: "Task updated successfully",
            task
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};

const getTasksByProject = async (req, res) => {
    try {

        const { PROJECT_ID } = req.params;

        // Check if project exists
        const project = await Project.findById(PROJECT_ID);

        if (!project) {
            return res.status(404).send({
                success: false,
                msg: "Project not found"
            });
        }

        // Find all tasks for this project
        const tasks = await Task.find({ project_ID: PROJECT_ID })
            .populate("project_ID", "title department")
            .populate("createdBy", "name email role");

        res.status(200).send({
            success: true,
            totalTasks: tasks.length,
            tasks
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};

const getTotalTasks = async (req, res) => {
    try {

        const totalTasks = await Task.countDocuments();

        res.status(200).send({
            success: true,
            totalTasks
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
};



module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    getTasksByProject,
    getTotalTasks

}