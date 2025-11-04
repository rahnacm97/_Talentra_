import { useState, useCallback } from "react";
import { jobFormSchema } from "../shared/validations/JobFormValidation";
import type { JobFormValues } from "../shared/validations/JobFormValidation";
import { ZodError } from "zod";

type FormattedErrors = {
  title?: { _errors: string[] };
  department?: { _errors: string[] };
  location?: { _errors: string[] };
  type?: { _errors: string[] };
  salary?: { _errors: string[] };
  description?: { _errors: string[] };
  requirements?: { _errors: string[] };
  responsibilities?: { _errors: string[] };
  deadline?: { _errors: string[] };
  experience?: { _errors: string[] };
  status?: { _errors: string[] };
};

export const useJobFormValidation = (
  initialValues: Partial<JobFormValues> = {},
) => {
  const [values, setValues] = useState<JobFormValues>({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: [""],
    responsibilities: [""],
    deadline: "",
    experience: "0",
    status: "active",
    ...initialValues,
  });

  const [errors, setErrors] = useState<FormattedErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((): boolean => {
    try {
      jobFormSchema.parse(values);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const formatted = err.format();
        setErrors(formatted as FormattedErrors);
      }
      return false;
    }
  }, [values]);

  const handleSubmit = async (
    onValidSubmit: (data: JobFormValues) => Promise<void>,
  ) => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onValidSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateExperience = (value: JobFormValues["experience"]) => {
    setValues((prev) => ({ ...prev, experience: value }));
  };

  return {
    values,
    setValues,
    updateExperience,
    errors,
    isSubmitting,
    validate,
    handleSubmit,
  };
};
