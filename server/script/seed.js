const { connect, connection, model, Schema, Types } = require("mongoose");
const { seedLeads } = require("./data.js");
require("dotenv").config();

console.log("🚀 Starting database seeding...");
const mongodbURI = process.env.MONGODB_URI;

// 1. Connect to your database
(async () => {
  if (!mongodbURI) {
    console.error("❌ MONGODB_URI is not defined in .env file.");
    process.exit(1);
  }
  await connect(mongodbURI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
      console.error("❌ Error connecting to MongoDB:", err);
      process.exit(1);
    });
})();

// 2. Define your Mongoose Models
const User = model(
  "User",
  new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
      },

      role: {
        type: String,
        enum: ["admin", "sales"],
        default: "sales",
      },

      refreshToken: [{ type: String }],
    },
    { timestamps: true }
  )
);

const Lead = model(
  "Lead",
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },

      status: {
        type: String,
        enum: ["new", "contacted", "qualified", "lost"],
        default: "new",
      },

      source: {
        type: String,
        enum: ["website", "instagram", "referral"],
        required: true,
      },

      remarks: { type: String, trim: true },
      createdBy: { type: Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
  )
);

// 3. Seeding function
async function seedDB() {
  try {
    let user = undefined;

    user = await User.findOne({ role: "admin" });
    if (!user) user = await User.findOne({ role: "sales" });

    if (!user) {
      console.error("❌ No user found to associate with leads.");
      return;
    }

    // Update createdBy field with actual user ID
    const leadsToInsert = seedLeads.map((lead) => ({
      ...lead,
      createdBy: user._id,
    }));

    // // Clear existing leads (optional)
    // await Lead.deleteMany({});

    // Insert seed leads
    await Lead.insertMany(leadsToInsert);

    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    // Close the connection
    connection.close();
  }
}

seedDB();
