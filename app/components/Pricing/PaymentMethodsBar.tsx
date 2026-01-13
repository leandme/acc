import React from "react";

type PaymentLogo = {
  src: string;      // e.g. "/payments/visa.svg"
  alt: string;      // e.g. "Visa"
  width?: number;   // optional override
  height?: number;  // optional override
};

export default function PaymentMethodsBar({
  logos,
}: {
  logos: PaymentLogo[];
}) {
  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 opacity-90">
        {logos.map((logo) => (
          <img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            className="h-6 w-auto opacity-80 transition"
            style={{
              height: (logo.height ?? 24) + "px",
            }}
          />
        ))}
      </div>

      <div className="mt-6 w-full max-w-5xl border-t border-base-200" />
    </div>
  );
}
