export function msToTime(ms: number) {
  let seconds = Math.floor((ms / 1000) % 60);
  let minutes = Math.floor((ms / (1000 * 60)) % 60);
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  let time = !hours ? [minutes, seconds] : [hours, minutes, seconds];

  return time.map((n) => (n < 10 ? '0' + n : n)).join(':');
}
