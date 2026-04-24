"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Units = "metric" | "imperial";

type Props = {
  initialImageUrl?: string | null;
  className?: string;

  // ✅ NEW: parent can trigger the refined run
  onRefine?: (payload: {
    units: Units;
    age: number;
    height: number;
    weight: number;
    waist?: number | null;
    extraImages: File[]; // slot 2/3 files (original image is already known by parent)
  }) => void;
};

type Slot = {
  file: File | null;
  previewUrl: string | null;
};

function rangeOptions(min: number, max: number, step = 1) {
  const out: number[] = [];
  for (let v = min; v <= max; v += step) out.push(v);
  return out;
}

function formatImperialHeight(totalInches: number) {
  const feet = Math.floor(totalInches / 12);
  const rawInches = totalInches - feet * 12;
  const roundedInches = Math.round(rawInches * 2) / 2;
  const inchesLabel = Number.isInteger(roundedInches)
    ? String(roundedInches)
    : roundedInches.toFixed(1);
  return `${feet}'${inchesLabel}`;
}

export default function EstimateRefineInline({
  initialImageUrl = null,
  className = "",
  onRefine,
}: Props) {
  // ✅ Default to imperial
  const [units, setUnits] = useState<Units>("imperial");

  // selectors store string values
  const [age, setAge] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [waist, setWaist] = useState<string>("");

  const [slots, setSlots] = useState<Slot[]>([
    { file: null, previewUrl: initialImageUrl ?? null }, // slot 1 shows original image
    { file: null, previewUrl: null }, // slot 2
    { file: null, previewUrl: null }, // slot 3
  ]);

  // keep slot 0 preview synced to initialImageUrl if user hasn't picked a file for slot 0
  useEffect(() => {
    setSlots((prev) => {
      const next = [...prev];
      if (!next[0]?.file) {
        next[0] = { ...next[0], previewUrl: initialImageUrl ?? null };
      }
      return next;
    });
  }, [initialImageUrl]);

  const inputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const ageOptions = useMemo(() => rangeOptions(18, 90, 1), []);
  const heightOptions = useMemo(() => {
    // metric: 140-210 cm, imperial: 55-83 in (0.5 in steps)
    return units === "metric" ? rangeOptions(140, 210, 1) : rangeOptions(55, 83, 0.5);
  }, [units]);

  const weightOptions = useMemo(() => {
    // metric: 40–160 kg, imperial: 90–350 lb
    return units === "metric" ? rangeOptions(40, 160, 1) : rangeOptions(90, 350, 1);
  }, [units]);

  const waistOptions = useMemo(() => {
    // optional
    // metric: 50–140 cm, imperial: 20–55 in
    return units === "metric" ? rangeOptions(50, 140, 1) : rangeOptions(20, 55, 1);
  }, [units]);

  const heightLabel = units === "metric" ? "Height (cm)" : "Height (ft/in)";
  const weightLabel = units === "metric" ? "Weight (kg)" : "Weight (lb)";
  const waistLabel = units === "metric" ? "Waist (cm)" : "Waist (in)";

  const hasAnyImage = useMemo(
    () => slots.some((s) => Boolean(s.previewUrl) || Boolean(s.file)),
    [slots]
  );

  const canSubmit = useMemo(() => {
    return Boolean(age && height && weight) && hasAnyImage;
  }, [age, height, weight, hasAnyImage]);

  function openPicker(i: number) {
    inputRefs[i].current?.click();
  }

  function onPickFile(i: number, file: File | null) {
    setSlots((prev) => {
      const next = [...prev];

      // Revoke old blob URL
      if (next[i]?.file && next[i]?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(next[i].previewUrl);
      }

      if (!file) {
        const fallback = i === 0 ? (initialImageUrl ?? null) : null;
        next[i] = { file: null, previewUrl: fallback };
        return next;
      }

      const url = URL.createObjectURL(file);
      next[i] = { file, previewUrl: url };
      return next;
    });

    // allow re-selecting same file
    if (inputRefs[i].current) inputRefs[i].current.value = "";
  }

  function removeSlot(i: number) {
    onPickFile(i, null);
  }

  function handleRefineClick() {
    if (!canSubmit) return;

    const payload = {
      units,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      waist: waist ? Number(waist) : null,
      extraImages: slots
        .slice(1) // slot 2/3 only
        .map((s) => s.file)
        .filter((f): f is File => Boolean(f)),
    };

    onRefine?.(payload);
  }

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">
          Increase Your Estimate Accuracy
        </h2>
        <p className="mt-4 text-gray-700 text-lg leading-relaxed text-center">
          Add measurements and up to 3 angles to tighten the estimate.
        </p>

        {/* Units toggle: Imperial on the LEFT, Metric on the RIGHT */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-semibold ${
              units === "imperial" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Imperial
          </span>

          <input
            type="checkbox"
            className="toggle toggle-primary"
            // checked = Metric (right side)
            checked={units === "metric"}
            onChange={(e) => setUnits(e.target.checked ? "metric" : "imperial")}
            aria-label="Toggle imperial/metric"
          />

          <span
            className={`text-sm font-semibold ${
              units === "metric" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Metric
          </span>
        </div>

        {/* Photos */}
        <div className="mt-10">
          <div className="mt-3 grid grid-cols-3 gap-3">
            {slots.map((slot, i) => {
              const isFilled = Boolean(slot.previewUrl);
              const label = i === 0 ? "Front" : i === 1 ? "Side" : "Back";

              return (
                <div key={i} className="relative">
                  <input
                    ref={inputRefs[i]}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPickFile(i, e.target.files?.[0] ?? null)}
                  />

                  <button
                    type="button"
                    onClick={() => openPicker(i)}
                    className={[
                      "w-full rounded-2xl border bg-base-200 overflow-hidden",
                      "aspect-[3/4] flex items-center justify-center",
                      "hover:shadow-md transition",
                    ].join(" ")}
                    aria-label={`Upload ${label} photo`}
                  >
                    {isFilled ? (
                      <img
                        src={slot.previewUrl!}
                        alt={`${label} photo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-3 flex flex-col items-center justify-center gap-2 text-center">
                        <div className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center border">
                          <span className="text-xl">+</span>
                        </div>
                        <div className="text-lg font-semibold text-gray-800">{label}</div>
                        <div className="text-lg text-gray-600">Tap to upload</div>
                      </div>
                    )}
                  </button>

                  {isFilled && (
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                      <span className="badge badge-neutral badge-sm">{label}</span>
                      <button
                        type="button"
                        className="btn btn-xs"
                        onClick={() => removeSlot(i)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selectors */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="form-control">
            <div className="label">
              <span className="label-text text-lg font-semibold">Age</span>
              <span className="label-text-alt text-gray-600">required</span>
            </div>
            <select
              className="select select-bordered w-full text-lg"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            >
              <option value="" disabled>
                Select age…
              </option>
              {ageOptions.map((v) => (
                <option key={v} value={String(v)}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text text-lg font-semibold">{heightLabel}</span>
              <span className="label-text-alt text-gray-600">required</span>
            </div>
            <select
              className="select select-bordered w-full text-lg"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            >
              <option value="" disabled>
                Select height…
              </option>
              {heightOptions.map((v) => (
                <option key={v} value={String(v)}>
                  {units === "metric" ? v : formatImperialHeight(v)}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text text-lg font-semibold">{weightLabel}</span>
              <span className="label-text-alt text-gray-600">required</span>
            </div>
            <select
              className="select select-bordered w-full text-lg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            >
              <option value="" disabled>
                Select weight…
              </option>
              {weightOptions.map((v) => (
                <option key={v} value={String(v)}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text text-lg font-semibold">{waistLabel}</span>
              <span className="label-text-alt text-gray-600">optional</span>
            </div>
            <select
              className="select select-bordered w-full text-lg"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
            >
              <option value="">Select waist…</option>
              {waistOptions.map((v) => (
                <option key={v} value={String(v)}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="btn btn-primary btn-lg text-white"
            disabled={!canSubmit}
            onClick={handleRefineClick}
          >
            Refine Estimate
          </button>
        </div>
      </div>
    </section>
  );
}
