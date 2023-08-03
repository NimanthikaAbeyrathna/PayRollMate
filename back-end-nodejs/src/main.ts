import express, {json} from 'express';
import {router} from "./api/employee-controller";
import cors from 'cors';

const app = express();
app.use(cors());

app.use(json());
app.use("/app/api/v1/employee", router);
app.listen(8085, () => console.log("server has been started at 8085"));