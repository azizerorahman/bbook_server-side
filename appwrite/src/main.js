import jwt from "jsonwebtoken";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

export default async ({ req, res, log, error }) => {
  let client = null;

  // Helper function to send JSON response with CORS headers
  const corsResponse = (data, status = 200) => {
    return res.json(data, status, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
    });
  };

  try {
    log("BBook API function started");
    log(`Request method: ${req.method || "GET"}, path: ${req.path || "/"}`);

    const path = req.path || "/";
    const method = req.method || "GET";
    const body = req.body
      ? typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body
      : {};
    const headers = req.headers || {};
    const query = req.query || {};

    // Handle preflight OPTIONS requests first
    if (method === "OPTIONS") {
      log("CORS preflight request handled");
      return res.text("", 200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400",
      });
    }

    // Root endpoint
    if (path === "/" && method === "GET") {
      return corsResponse({
        message: "Hello from BBOOK Server.",
        status: "API is running",
        timestamp: new Date().toISOString(),
      });
    }

    // Connect to MongoDB
    const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_UPass}@cluster0.rhdf1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    await client.connect();
    const database = client.db("bBook");
    const bookCollection = database.collection("book");
    const userReviewCollection = database.collection("userReview");

    // JWT Verification function
    const verifyJWT = (token) => {
      try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch (err) {
        throw new Error("Invalid or expired token");
      }
    };

    // Authentication endpoint - Generate token
    if (path === "/token" && method === "POST") {
      try {
        const user = body;
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1d",
        });
        return corsResponse({ accessToken });
      } catch (err) {
        error(`Token generation error: ${err.message}`);
        return corsResponse({ error: "Failed to generate token" }, 500);
      }
    }

    // Get all books
    if (path === "/books" && method === "GET") {
      try {
        const books = await bookCollection.find({}).toArray();
        return corsResponse(books);
      } catch (err) {
        error(`Get books error: ${err.message}`);
        return corsResponse({ error: "Failed to fetch books" }, 500);
      }
    }

    // Get book by ID
    if (path.match(/^\/inventory\/[a-f\d]{24}$/i) && method === "GET") {
      try {
        const id = path.split("/")[2];
        const book = await bookCollection.findOne({ _id: ObjectId(id) });
        if (!book) {
          return corsResponse({ error: "Book not found" }, 404);
        }
        return corsResponse(book);
      } catch (err) {
        error(`Get book by ID error: ${err.message}`);
        return corsResponse({ error: "Failed to fetch book" }, 500);
      }
    }

    // Get books by user (protected route)
    if (path === "/my-books" && method === "GET") {
      try {
        const authHeader = headers.authorization;
        if (!authHeader) {
          return corsResponse(
            { status: 401, error: "No authorization header" },
            401
          );
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyJWT(token);

        const email = query.email;
        const decodedEmail = decoded.email;

        if (email !== decodedEmail) {
          return corsResponse({ status: 403, error: "Access denied" }, 403);
        }

        const myBooks = await bookCollection.find({ email: email }).toArray();
        return corsResponse(myBooks);
      } catch (err) {
        if (err.message === "Invalid or expired token") {
          return corsResponse({ status: 403, error: "Invalid token" }, 403);
        }
        error(`Get my books error: ${err.message}`);
        return corsResponse({ error: "Failed to fetch user books" }, 500);
      }
    }

    // Add new book
    if (path === "/books" && method === "POST") {
      try {
        const book = body;
        const result = await bookCollection.insertOne(book);
        return corsResponse(result);
      } catch (err) {
        error(`Add book error: ${err.message}`);
        return corsResponse({ error: "Failed to add book" }, 500);
      }
    }

    // Update book quantity
    if (path.match(/^\/inventory\/[a-f\d]{24}$/i) && method === "PUT") {
      try {
        const id = path.split("/")[2];
        const updatedInfo = body;

        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const setUpdatedInfo = {
          $set: {
            quantity: updatedInfo.updatedQuantity,
            sold: updatedInfo.updatedSold,
          },
        };

        const result = await bookCollection.updateOne(
          filter,
          setUpdatedInfo,
          options
        );
        return corsResponse(result);
      } catch (err) {
        error(`Update book error: ${err.message}`);
        return corsResponse({ error: "Failed to update book" }, 500);
      }
    }

    // Delete book
    if (path.match(/^\/inventory\/[a-f\d]{24}$/i) && method === "DELETE") {
      try {
        const id = path.split("/")[2];
        const result = await bookCollection.deleteOne({ _id: ObjectId(id) });
        return corsResponse(result);
      } catch (err) {
        error(`Delete book error: ${err.message}`);
        return corsResponse({ error: "Failed to delete book" }, 500);
      }
    }

    // Get all user reviews
    if (path === "/user-reviews" && method === "GET") {
      try {
        const userReviews = await userReviewCollection.find({}).toArray();
        return corsResponse(userReviews);
      } catch (err) {
        error(`Get user reviews error: ${err.message}`);
        return corsResponse({ error: "Failed to fetch user reviews" }, 500);
      }
    }

    // 404 handler
    return corsResponse({ error: "Endpoint not found" }, 404);
  } catch (err) {
    error(`General error: ${err.message}`);
    return corsResponse(
      {
        error: "Internal server error",
        message: err.message,
      },
      500
    );
  } finally {
    // Close MongoDB connection
    if (client) {
      try {
        await client.close();
        log("MongoDB connection closed");
      } catch (err) {
        error(`Error closing MongoDB connection: ${err.message}`);
      }
    }
  }
};
