import express from 'express';
import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import logsRoutes from './routes/logs.routes.js';
import taskRoutes from './routes/task.routes.js';
import departmentRoutes from './routes/department.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import leadRoutes from './routes/leads.routes.js';
import connectDB from './db/connect_db.js';
import Constants from './constant.js';
import cors from 'cors'

const app = express();

app.use(cors());
// app.use(cors({ origin: "https://snapbasket.netlify.app", credentials: true }));
app.use(express.json());
connectDB(Constants.DB_URI); 

app.use('/auth/api', authRoutes);
app.use('/client/api', clientRoutes);
app.use('/lead/api', leadRoutes);
app.use('/logs/api', logsRoutes);
app.use('/task/api', taskRoutes);
app.use('/department/api', departmentRoutes);
app.use('/notification/api', notificationRoutes);

const PORT = Constants.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});              