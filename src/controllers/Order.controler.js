import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/Order.model.js";
import { User } from "../models/User.model.js";
const placeOrder = asyncHandler(async (req, res) => {
  const { customerId, products, totalAmount, shippingInfo, paymentInfo } =
    req.body;

  // Validate required fields
  if (
    !customerId ||
    !products ||
    !totalAmount ||
    !shippingInfo ||
    !paymentInfo
  ) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    // Create the order
    const customer = await User.findById(customerId);

    if (!customer) {
      throw new ApiError(404, "Customer not found");
    }
    const order = await Order.create({
      customer: customer._id, // Saving customer ID in the order
      customerName: customer.name,
      products,
      totalAmount,
      shippingInfo,
      paymentInfo,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  } catch (error) {
    console.error("Error placing order:", error);
    throw new ApiError(500, "Something went wrong while placing the order");
  }
});
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();

    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new ApiError(500, "Something went wrong while fetching orders");
  }
});
const getOrderById = async (req, res) => {
  const { id } = req.params; // Extract the order ID from request parameters
  console.log("Received order ID:", id);
  try {
    // Find the order by ID
    const order = await Order.findById(id)
      .populate({ path: "customer", select: ["fullName", "email", "mobile"] }) // Populate customer with fullName field only
      .populate({
        path: "products.product",
        select: [
          "productTitle",
          "image",
          "thumbnail",
          "oneTimePrice",
          "subscriptionPrice",
          "discountPercentage",
          "rating",

          "category",
        ],
      });
    console.log("Retrieved order:", order);
    // If order is not found, return an error response
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // If order is found, return success response with order details
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    // If any error occurs during retrieval, return an error response
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const orderId = req.body.orderID;

    if (!orderId) {
      throw new ApiError(400, "Order ID is required");
    }

    const { status } = req.body;

    if (!status) {
      throw new ApiError(400, "Status field is required");
    }

    // Check if the status is one of the allowed values
    const allowedStatusValues = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!allowedStatusValues.includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }

    // Find the order by orderID and update its status
    const order = await Order.findOneAndUpdate(
      { orderID: orderId },
      { status },
      { new: true } // Return the updated document
    );

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order status updated successfully"));
  } catch (error) {
    console.error("Error updating order status:", error);
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(
        500,
        "Something went wrong while updating order status"
      );
    }
  }
});

export { placeOrder, getAllOrders, updateOrderStatus, getOrderById };
