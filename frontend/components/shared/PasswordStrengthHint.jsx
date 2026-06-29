"use client";

function getStrength(password) {
  if (!password) return { label: "", score: 0 };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", score };
  if (score <= 2) return { label: "Fair", score };
  if (score === 3) return { label: "Good", score };
  return { label: "Strong", score };
}

export default function PasswordStrengthHint({ password }) {
  const { label, score } = getStrength(password);

  if (!password) return null;

  const colors = ["bg-destructive", "bg-destructive", "bg-accent", "bg-primary", "bg-primary"];

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < score ? colors[score] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Strength: <span className="font-medium">{label}</span> — use 8+ characters with a mix of
        uppercase, numbers, and symbols.
      </p>
    </div>
  );
}