import React from "react";
import { X, Plus, Save } from "lucide-react";
import { useJobFormValidation } from "../../hooks/UseJobForm";
import type { JobFormValues } from "../../shared/validations/JobFormValidation";

interface JobFormModalProps {
  mode: "post" | "edit" | "view";
  initialValues?: Partial<JobFormValues>;
  onSubmit: (values: JobFormValues) => Promise<void>;
  onClose: () => void;
}

const JobFormModal: React.FC<JobFormModalProps> = ({
  mode,
  initialValues = {},
  onSubmit,
  onClose,
}) => {
  const {
    values,
    setValues,
    updateExperience,
    errors,
    isSubmitting,
    handleSubmit,
  } = useJobFormValidation(initialValues);

  const addField = (key: "requirements" | "responsibilities") => {
    setValues((p) => ({ ...p, [key]: [...(p[key] || []), ""] }));
  };

  const updateField = (
    key: "requirements" | "responsibilities",
    idx: number,
    val: string,
  ) => {
    setValues((p) => {
      const arr = [...(p[key] || [])];
      arr[idx] = val;
      return { ...p, [key]: arr };
    });
  };

  const removeField = (
    key: "requirements" | "responsibilities",
    idx: number,
  ) => {
    setValues((p) => ({
      ...p,
      [key]: (p[key] || []).filter((_, i) => i !== idx),
    }));
  };

  const getArrayError = (field?: { _errors?: string[] }): string | undefined =>
    field?._errors?.[0];

  const getItemErrors = (
    field?: Record<string, { _errors?: string[] }> | { _errors?: string[] },
  ): string[] => {
    if (!field) return [];

    if (
      "_errors" in field &&
      Object.keys(field).every((k) => k === "_errors")
    ) {
      return [];
    }

    return Object.keys(field)
      .filter((k) => !isNaN(Number(k)))
      .map((k) => (field as any)[k]._errors?.[0] || "")
      .filter(Boolean);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "post" ? "Post New Job" : "Edit Job"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
          }}
          className="p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title *"
              value={values.title}
              onChange={(v) => setValues((p) => ({ ...p, title: v }))}
              error={getArrayError(errors.title)}
            />
            <Input
              label="Department *"
              value={values.department}
              onChange={(v) => setValues((p) => ({ ...p, department: v }))}
              error={getArrayError(errors.department)}
            />
            <Input
              label="Location *"
              value={values.location}
              onChange={(v) => setValues((p) => ({ ...p, location: v }))}
              error={getArrayError(errors.location)}
            />
            {/* <Select
              label="Job Type *"
              value={values.type}
              onChange={(v) => setValues((p) => ({ ...p, type: v as any }))}
              options={[
                { value: "Full-time", label: "Full-time" },
                { value: "Part-time", label: "Part-time" },
                { value: "Contract", label: "Contract" },
                { value: "Internship", label: "Internship" },
              ]}
              error={getArrayError(errors.type)}
            /> */}
            <Input
              label="Salary Range"
              value={values.salary ?? ""}
              onChange={(v) => setValues((p) => ({ ...p, salary: v }))}
              placeholder="e.g. 120k - 150k"
              error={getArrayError(errors.salary)}
            />
            <Input
              label="Application Deadline *"
              type="date"
              value={values.deadline}
              onChange={(v) => setValues((p) => ({ ...p, deadline: v }))}
              error={getArrayError(errors.deadline)}
            />
            {/* <Select
              label="Experience Level *"
              value={values.experience}
              onChange={updateExperience}
              options={[
                { value: "0", label: "Fresher (0 years)" },
                { value: "1-2", label: "1-2 years" },
                { value: "3-5", label: "3-5 years" },
                { value: "6-8", label: "6-8 years" },
                { value: "9-12", label: "9-12 years" },
                { value: "13+", label: "13+ years" },
              ]}
              error={getArrayError(errors.experience)}
            /> */}

            {/* Job Type Select */}
            <Select
              label="Job Type *"
              value={values.type}
              onChange={(v) => setValues((p) => ({ ...p, type: v }))}
              options={[
                { value: "Full-time", label: "Full-time" },
                { value: "Part-time", label: "Part-time" },
                { value: "Contract", label: "Contract" },
                { value: "Internship", label: "Internship" },
              ]}
              error={getArrayError(errors.type)}
            />

            {/* Experience Select */}
            <Select
              label="Experience Level *"
              value={values.experience}
              onChange={updateExperience}
              options={[
                { value: "0", label: "Fresher (0 years)" },
                { value: "1-2", label: "1–2 years" },
                { value: "3-5", label: "3–5 years" },
                { value: "6-8", label: "6–8 years" },
                { value: "9-12", label: "9–12 years" },
                { value: "13+", label: "13+ years" },
              ]}
              error={getArrayError(errors.experience)}
            />
          </div>

          <Textarea
            label="Job Description *"
            value={values.description}
            onChange={(v) => setValues((p) => ({ ...p, description: v }))}
            rows={4}
            placeholder="Describe the role..."
            error={getArrayError(errors.description)}
          />

          <ArrayField
            label="Requirements"
            items={values.requirements || []}
            arrayError={getArrayError(errors.requirements)}
            itemErrors={getItemErrors(errors.requirements)}
            onAdd={() => addField("requirements")}
            onUpdate={(i, v) => updateField("requirements", i, v)}
            onRemove={(i) => removeField("requirements", i)}
          />

          <ArrayField
            label="Responsibilities"
            items={values.responsibilities || []}
            arrayError={getArrayError(errors.responsibilities)}
            itemErrors={getItemErrors(errors.responsibilities)}
            onAdd={() => addField("responsibilities")}
            onUpdate={(i, v) => updateField("responsibilities", i, v)}
            onRemove={(i) => removeField("responsibilities", i)}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              <span>
                {isSubmitting
                  ? "Saving..."
                  : mode === "post"
                    ? "Post Job"
                    : "Save Changes"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}> = ({ label, value, onChange, type = "text", placeholder, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-indigo-500"
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// const Select: React.FC<{
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
//   options: { value: string; label: string }[];
//   error?: string;
// }> = ({ label, value, onChange, options, error }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">
//       {label}
//     </label>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
//         error
//           ? "border-red-500 focus:ring-red-500"
//           : "border-gray-300 focus:ring-indigo-500"
//       }`}
//     >
//       {options.map((o) => (
//         <option key={o.value} value={o.value}>
//           {o.label}
//         </option>
//       ))}
//     </select>
//     {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//   </div>
// );

type SelectOption<T extends string> = { value: T; label: string };

interface SelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: SelectOption<T>[];
  error?: string;
}

const Select = <T extends string>({
  label,
  value,
  onChange,
  options,
  error,
}: SelectProps<T>) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-indigo-500"
      }`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const Textarea: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  error?: string;
}> = ({ label, value, onChange, rows = 3, placeholder, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-indigo-500"
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const ArrayField: React.FC<{
  label: string;
  items: string[];
  arrayError?: string;
  itemErrors: string[];
  onAdd: () => void;
  onUpdate: (idx: number, val: string) => void;
  onRemove: (idx: number) => void;
}> = ({ label, items, arrayError, itemErrors, onAdd, onUpdate, onRemove }) => {
  // Generate a stable key for each item
  const getItemKey = (index: number) => `array-item-${label}-${index}`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {arrayError && <p className="mb-2 text-sm text-red-600">{arrayError}</p>}

      {items.map((item, i) => (
        <div key={getItemKey(i)} className="flex items-center space-x-2 mb-2">
          <div className="flex-1">
            <input
              type="text"
              value={item}
              onChange={(e) => onUpdate(i, e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                itemErrors[i]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {itemErrors[i] && (
              <p className="mt-1 text-sm text-red-600">{itemErrors[i]}</p>
            )}
          </div>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-red-600 hover:text-red-800 p-2"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
      >
        <Plus className="w-4 h-4" />
        <span>Add {label.slice(0, -1)}</span>
      </button>
    </div>
  );
};

export default JobFormModal;
