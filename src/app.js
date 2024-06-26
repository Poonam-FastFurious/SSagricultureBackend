import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import

import adminrouter from "./routes/Admin.routes.js";
import userrouter from "./routes/user.routes.js";
import tax from "./routes/tax.routes.js";
import coupon from "./routes/coupon.routes.js";
import deliverycharg from "./routes/Delivercharg.routes.js";
import category from "./routes/Category.routes.js";
import Banner from "./routes/Banner.routes.js";
import Product from "./routes/Product.routes.js";
import cart from "./routes/cart.routes.js";
import Order from "./routes/Order.routes.js";
import paymentRoutes from "./routes/Payments.routes.js";
import privacy from "./routes/Privacypolicy.routes.js";
import termscondtion from "./routes/Termscondition.routes.js";
import blogs from "./routes/Bloge.routes.js";
//routes declearetion

app.use("/api/v1/admin", adminrouter);
app.use("/api/v1/user", userrouter);
app.use("/api/v1/tax", tax);
app.use("/api/v1/coupon", coupon);
app.use("/api/v1/deliverycharg", deliverycharg);
app.use("/api/v1/category", category);
app.use("/api/v1/Banner", Banner);
app.use("/api/v1/Product", Product);
app.use("/api/v1/cart", cart);
app.use("/api/v1/order", Order);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/privacy", privacy);
app.use("/api/v1/terms", termscondtion);
app.use("/api/v1/blog", blogs);
export { app };
