"use client";

type Props = {
  id: string;
  label: string;
  placeholder?: string;
  defaultValue?: string | null;
};

export default function TextField({
  id,
  label,
  placeholder,
  defaultValue,
}: Props) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-2 rounded-md">
        <input
          id={id}
          name={id}
          type="text"
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        />
      </div>
    </div>
  );
}
