import zod from "zod";

export const createLeadSchema = zod.object({
  name: zod.string().min(1, "Name is required"),
  email: zod.string().email("Invalid email address"),
  source: zod.enum(["website", "instagram", "referral"], {
    message: "Source must be one of website, instagram or referral",
  }),
  remarks: zod.string().optional(),
});

export const updateLeadSchema = zod.object({
  name: zod.string().min(1, "Name is required").optional(),
  email: zod.string().email("Invalid email address").optional(),
  status: zod
    .enum(["new", "contacted", "qualified", "lost"], {
      message: "Status must be one of new, contacted, qualified or lost",
    })
    .optional(),
  source: zod
    .enum(["website", "instagram", "referral"], {
      message: "Source must be one of website, instagram or referral",
    })
    .optional(),
  remarks: zod.string().optional(),
});
