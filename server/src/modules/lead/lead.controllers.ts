import { ApiError, ApiResponse } from "@/utils/apiHandler";
import { asyncHandler } from "@/utils/asyncHandler";
import { Lead } from "@/models";
import { createLeadSchema, updateLeadSchema } from "./lead.validations";

const createLead = asyncHandler(async (req, res) => {
  // write a steps to create a lead
  // 1. validate input
  // 2. create lead with createdBy field as user id from request (set by auth middleware)
  // 3. return response

  const payload = createLeadSchema.parse(req.body);

  const lead = await Lead.create({
    ...payload,
    createdBy: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Lead created successfully", lead));
});

const updateLead = asyncHandler(async (req, res) => {
  // write a steps to update a lead
  // 1. validate input
  // 2. find lead by id and update with new data only if user is admin or user is creator of the lead
  // 3. return response

  const { id } = req.params;
  const updateData = updateLeadSchema.parse(req.body);
  const user = req.user!;

  let lead = undefined;

  if (user.role === "admin") {
    lead = await Lead.findByIdAndUpdate(id, updateData, { new: true });
  } else {
    lead = await Lead.findOneAndUpdate(
      { _id: id, createdBy: user._id },
      updateData,
      { new: true }
    );
  }

  if (!lead) throw new ApiError(404, "Lead not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Lead updated successfully", lead));
});

const deleteLead = asyncHandler(async (req, res) => {
  // write a steps to delete a lead
  // 1. find lead by id and delete only if user is admin or user is creator of the lead
  // 2. return response

  const { id } = req.params;
  const user = req.user!;

  let lead = undefined;

  if (user.role === "admin") {
    lead = await Lead.findByIdAndDelete(id);
  } else {
    lead = await Lead.findOneAndDelete({ _id: id, createdBy: user._id });
  }

  if (!lead) throw new ApiError(404, "Lead not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Lead deleted successfully", lead));
});

const getLeadByID = asyncHandler(async (req, res) => {
  // write a steps to get a lead
  // 1. find lead by id and return only if user is admin or user is creator of the lead
  // 2. return response

  const { id } = req.params;
  const user = req.user!;

  let lead = undefined;

  if (user.role === "admin") {
    lead = await Lead.findById(id).populate("createdBy", "name email role");
  } else {
    lead = await Lead.findOne({ _id: id, createdBy: user._id }).populate(
      "createdBy",
      "name email role"
    );
  }

  console.log("lead", lead);

  if (!lead) throw new ApiError(404, "Lead not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Lead fetched successfully", lead));
});

const getLeads = asyncHandler(async (req, res) => {
  // write a steps to get leads with pagination and search
  // 1. get page and limit from query params with default values
  // 2. create filter object based on search query param and user role (admin can see all leads, user can see only their leads)
  // 3. fetch leads from database with filter, pagination and sorting by createdAt in descending order
  // 4. return response with leads and meta data (total, page, limit, pages)

  const user = (req as any).user!;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 10, 1);

  const filter: any = {};

  if (user.role !== "admin") filter.createdBy = user._id;
  const allowedFilters = ["search", "status", "source"];

  allowedFilters.forEach((field) => {
    const value = req.query[field];
    if (typeof value === "string" && value.trim() !== "") {
      if (field === "search") {
        filter.$or = [
          { name: new RegExp(value.trim(), "i") },
          { email: new RegExp(value.trim(), "i") },
        ];
      } else {
        filter[field] = new RegExp(value.trim(), "i");
      }
    }
  });

  const total = await Lead.countDocuments(filter);

  const leads = await Lead.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("createdBy", "name email role");

  return res.status(200).json(
    new ApiResponse(200, "Leads fetched successfully", {
      leads,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    })
  );
});

export { createLead, updateLead, deleteLead, getLeadByID, getLeads };
