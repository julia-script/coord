export function formatDuration(milliseconds: number, showHours = false) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = Math.floor(seconds % 60);

  return (showHours ? [hours, minutes, secondsLeft] : [minutes, secondsLeft])
    .map((n) => n.toString().padStart(2, "0"))
    .join(":");
}
