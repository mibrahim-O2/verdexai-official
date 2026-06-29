export default function LoadingSpinner({ size = 24 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: "3px solid var(--border)",
        borderTopColor: "var(--primary)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
      className="loading-spinner"
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}