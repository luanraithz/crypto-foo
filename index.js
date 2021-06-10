import express from 'express';
import path from 'path';
import dotEnv from "dotenv";
import { registerRoutes } from "./server/index";


dotEnv.config();

const app = express();

registerRoutes(app);

const port = process.env.PORT || process.env.port || 5000;
if (!process.env.MIN_API_TOKEN) {
  console.log("MIN API TOKEN not found")
  process.exit(1)
} 

if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  })    

}  

app.listen(port, () => console.log(`Server started on port ${port}`));
