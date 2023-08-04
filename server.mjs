import express from 'express';
import mongoose from 'mongoose';
import connectDB from "./config/dbConn.mjs";
import routes from './routes/routes.mjs';
import cors from 'cors';
import cookieParser from "cookie-parser";

//Connect to MongoDB
connectDB();

const app = express();
app.use(cors({
    credentials: true,
    origin: ['http://localhost:8080'],
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

// nur wenn verbindung zur MongoDB steht, wird der Server gestartet
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
    app.listen(3000, () => console.log('Server running on port 3000'));
});

