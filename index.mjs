import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/routes.mjs';
import cors from 'cors';
import cookieParser from "cookie-parser";

mongoose.connect('mongodb://localhost/nodeauth', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Verbunden mit MongoDB'))
    .catch((err) => console.error('Fehler beim Verbinden mit MongoDB:', err));



const app = express();
app.use(cors({
    credentials: true,
    origin: ['http://localhost:8080'],
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);



app.listen(3000, () => console.log('Server running on port 3000'));
