import app from "./app.js";
import userRoutes from "./routes/userRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

app.get("/", (req, res) => {
  res.send("server is listenning...");
});

app.use("/user", userRoutes);
app.use("/users", usersRoutes);
app.use("/product", productRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} made on port: ${PORT}`.green
      .bold
  )
);