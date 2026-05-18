"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createLeadSchema,
  updateLeadSchema,
  type CreateLeadFormData,
  type UpdateLeadFormData,
} from "@/lib/validations";
import { apiClient } from "@/lib/api";
import type { Lead } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  onSuccess: () => void;
}

export function LeadDialog({
  open,
  onOpenChange,
  lead,
  onSuccess,
}: LeadDialogProps) {
  const isEdit = !!lead;
  const [isLoading, setIsLoading] = useState(false);

  const schema = isEdit ? updateLeadSchema : createLeadSchema;
  type FormData = UpdateLeadFormData | CreateLeadFormData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? {
          name: lead.name,
          email: lead.email,
          status: lead.status,
          source: lead.source,
          remarks: lead.remarks,
        }
      : {},
  });

  const statusValue = watch("status");
  const sourceValue = watch("source");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (isEdit && lead) {
        await apiClient.updateLead(lead._id, data as UpdateLeadFormData);
        toast.success("Lead updated successfully!");
      } else {
        await apiClient.createLead(data as CreateLeadFormData);
        toast.success("Lead created successfully!");
      }
      onSuccess();
      reset();
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Operation failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Lead" : "Create Lead"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the lead information"
              : "Add a new lead to your dashboard"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Lead name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="lead@example.com"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusValue || ""}
                onValueChange={(value) =>
                  setValue("status", value as Lead["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select
              value={sourceValue || ""}
              onValueChange={(value) =>
                setValue("source", value as Lead["source"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
              </SelectContent>
            </Select>
            {errors.source && (
              <p className="text-sm text-destructive">
                {errors.source.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              placeholder="Additional notes"
              {...register("remarks")}
            />
            {errors.remarks && (
              <p className="text-sm text-destructive">
                {errors.remarks.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEdit ? "Update Lead" : "Create Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
