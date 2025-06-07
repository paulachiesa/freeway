"use client";

type Props = {
  id: string;
  label: string;
  defaultValue?: number | null;
};

export default function NumberField({ id, label, defaultValue }: Props) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-2 rounded-md">
        <input
          id={id}
          name={id}
          type="number"
          defaultValue={defaultValue ?? ""}
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        />
      </div>
    </div>
  );
}
