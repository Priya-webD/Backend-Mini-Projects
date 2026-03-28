import {Router} from 'express'; 

import { healthCheck } from "../controllers/healthcheck.controllers.js";
// Create a router instance

const router = Router();

router.route("/").get(healthCheck); // Define the route for health check 
// //get request to the root path will trigger the healthCheck controller

export default router; // export the router to be used in the main application file 