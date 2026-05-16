import app from "@/app";
import env from "@/config/env";
import connectDB from "@/config/db";

connectDB()
  .then(() => {
    app.listen(env.port, () =>
      console.log(`⚙️ Server is running at port : ${env.port}`)
    );
  })
  .catch((err) => console.log("MONGO db connection failed!", err));
