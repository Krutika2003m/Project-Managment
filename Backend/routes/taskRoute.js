const express = require('express')
const {auth, admin} =require('../middleware/auth')
const uploadFiles = require('../middleware/docMulter')
const {
    createTask,
     getAllTasks,
     getTaskById,
     updateTask,
    // updateTaskStatus,
    // deleteTask,
     getTasksByProject,
     getTotalTasks
} = require("../controllers/taskController");

const router = express.Router()



router.post("/create", auth, uploadFiles.single("docPath"), createTask);

router.get("/getAllTasks", auth, getAllTasks);

 router.get("/getTaskById/:ID", auth, getTaskById);

router.patch("/updateTask/:ID", auth, uploadFiles.single("docPath"), updateTask);
// router.patch("/updateTaskStatus/:ID", auth, updateTaskStatus);

// router.delete("/deleteTask/:ID", auth, deleteTask);

 router.get("/getTasksByProject/:PROJECT_ID", auth, getTasksByProject);

 router.get("/getTotalTasks", auth, getTotalTasks);





// 1. /getTasksByStatus.    ?status=""

// 2. /getTasksBySelectedMonth 



//getTotalTasks
//getTotalCompletedTask
//getTotalInprogressTask 


module.exports = router


// http://localhost:7005/task/create 
// {
//     "title":"Learn MERN",
//     "Description":"ert dfghj tyui bnm",
//     "startDate":"2026-06-10",
//     "endDate":"2026-06-30",

// }