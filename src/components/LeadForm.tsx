"use client";
import { AnimatePresence, motion } from "framer-motion";
import { type FormEvent, useEffect, useRef, useState } from "react";

type FieldConfig = {
  name:
    | "name"
    | "phone"
    | "email"
    | "locality"
    | "city"
    | "district"
    | "state";
  label: string;
  placeholder: string;
  type?: string;
  entryId: string;
  autoComplete?: string;
};

const LOGO_SRC = "/images/IND%20SolPower.png";

const FIELD_CONFIG: FieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    placeholder: "Enter your full name",
    entryId: "entry.1360879267",
    autoComplete: "name",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "+91 98765 43210",
    entryId: "entry.1895521193",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Email ID",
    placeholder: "you@example.com",
    type: "email",
    entryId: "entry.535716458",
    autoComplete: "email",
  },
  {
    name: "locality",
    label: "Locality",
    placeholder: "Enter your locality",
    entryId: "entry.1954704971",
  },
  {
    name: "city",
    label: "City",
    placeholder: "Enter your city",
    entryId: "entry.2123813797",
  },
  {
    name: "district",
    label: "District",
    placeholder: "Enter your district",
    entryId: "entry.674512344",
  },
  {
    name: "state",
    label: "State",
    placeholder: "Enter your state",
    entryId: "entry.1543822120",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + index * 0.05, duration: 0.4 },
  }),
};

type ToastState = {
  type: "success" | "error";
  message: string;
};

export default function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerToast = (type: ToastState["type"], message: string) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 4200);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formElement = e.currentTarget;
    const capturedValues = new FormData(formElement);
    const submission = new FormData();

    FIELD_CONFIG.forEach(({ name, entryId }) => {
      submission.append(entryId, String(capturedValues.get(name) ?? ""));
    });

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSd4AIO6G3Brzs7A0mXxvjnMOnQvbhk32VOKZrmrel9Zrl2RcQ/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: submission,
        }
      );

      triggerToast("success", "Enquiry received! Our team will reach out shortly.");
      formElement.reset();
    } catch (error) {
      triggerToast("error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const [primaryField, ...secondaryFields] = FIELD_CONFIG;

  return (
    <motion.section
      className="enquiry-card"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <motion.span
        className="card-glow"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <motion.span
        className="card-orb card-orb--top"
        aria-hidden="true"
        initial={{ opacity: 0, x: -20, y: -30 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      />

      <motion.span
        className="card-orb card-orb--bottom"
        aria-hidden="true"
        initial={{ opacity: 0, x: 20, y: 30 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      />

      <div className="toast-layer">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.type + toast.message}
              className={`toast ${toast.type === "success" ? "toast--success" : "toast--error"}`}
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              role="status"
              aria-live="assertive"
            >
              <span className="toast-badge" aria-hidden="true" />
              <p>{toast.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <span className="sr-only" aria-live="polite">
          {toast?.message}
        </span>
      </div>

      <motion.span
        className="enquiry-badge"
        initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      >
        <motion.img
          className="enquiry-logo"
          src={LOGO_SRC}
          alt="IND SolPower logo"
          initial={{ rotate: -15, scale: 0.95 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 140 }}
        />
      </motion.span>

      <motion.div
        className="headline"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1>Enquiry Form</h1>
        <p>Fill in your details and we will reach out shortly.</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="enquiry-form"
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="field-block"
          variants={fieldVariants}
          custom={0}
        >
          <label htmlFor={primaryField.name} className="input-label">
            {primaryField.label}
          </label>
          <motion.input
            id={primaryField.name}
            name={primaryField.name}
            placeholder={primaryField.placeholder}
            type={primaryField.type ?? "text"}
            autoComplete={primaryField.autoComplete}
            required
            className="input-field"
            whileFocus={{ scale: 1.01, backgroundColor: "#ffffff" }}
            whileHover={{ translateY: -1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        <div className="enquiry-grid">
          {secondaryFields.map((field, index) => (
            <motion.div
              className="field-block"
              key={field.name}
              variants={fieldVariants}
              custom={index + 1}
            >
              <label htmlFor={field.name} className="input-label">
                {field.label}
              </label>
              <motion.input
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                required
                className="input-field"
                whileFocus={{ scale: 1.01, backgroundColor: "#ffffff" }}
                whileHover={{ translateY: -1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          ))}
        </div>

        <motion.button
          type="submit"
          className="submit-button"
          disabled={loading}
          whileHover={{ y: -2 }}
          whileTap={{ y: 1, scale: 0.99 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {loading ? "Submitting..." : "Submit Enquiry"}
        </motion.button>

        <p className="disclaimer">
          Your information is secure and will never be shared with third parties.
        </p>
      </motion.form>
    </motion.section>
  );
}
