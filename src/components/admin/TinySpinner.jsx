export default function TinySpinner({ className = "" }) {
  return (
    <span
      className={
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-stone-700 " +
        className
      }
      aria-label="loading"
    />
  );
}
