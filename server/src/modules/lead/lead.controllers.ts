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
    lead = await Lead.findById(id);
  } else {
    lead = await Lead.findOne({ _id: id, createdBy: user._id });
  }

  if (!lead) throw new ApiError(404, "Lead not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Lead fetched successfully", lead));
});

const getLeads = asyncHandler(async (req, res) => {
  // write a steps to get leads with pagination and search
  // 1. get page, limit and search from query params
  // 2. create filter object based on search query (search in name, email, phone and company fields)
  // 3. if user is not admin then add createdBy field to filter with user id from request (set by auth middleware)
  // 4. get total count of leads based on filter
  // 5. get leads based on filter with pagination and sorting by createdAt field in descending order
  // 6. return response with leads and meta data (total, page, limit and pages)

  const user = (req as any).user!;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 10, 1);
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";

  const filter: any = {};

  if (user.role !== "admin") filter.createdBy = user._id;

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
      { company: regex },
    ];
  }

  const total = await Lead.countDocuments(filter);
  const leads = await Lead.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, "Leads fetched successfully", {
      leads,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    })
  );
});

export { createLead, updateLead, deleteLead, getLeadByID, getLeads };
