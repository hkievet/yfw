/**
 * Might be useful to use a library?
 */
export interface TimeStamp {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

// returns: hh:mm:ss.ms (note the period, not comma)
export function timeStampToString(timeStamp: TimeStamp) {
  return `${[timeStamp.hours, timeStamp.minutes, timeStamp.seconds].join(
    ":"
  )}.${timeStamp.milliseconds}`;
}

// expects: hh:mm:ss,ms (note the comma, note period)
// Whisper generates srt files with this
export function timeStampFromString(inputString: string): TimeStamp {
  let [hhmmss, ms] = inputString.split(",");
  let [hh, mm, ss] = hhmmss.split(":");
  return {
    hours: Number.parseInt(hh),
    minutes: Number.parseInt(mm),
    seconds: Number.parseInt(ss),
    milliseconds: Number.parseInt(ms),
  };
}

export function timeStampToMilliseconds(timeStamp: TimeStamp): number {
  const { hours, minutes, seconds, milliseconds } = timeStamp;
  let sumMilliseconds = milliseconds;
  sumMilliseconds += seconds * 1000;
  sumMilliseconds += minutes * 60 * 1000;
  sumMilliseconds += hours * 60 * 60 * 1000;
  return sumMilliseconds;
}

/**
 * Showcase code for future job applications.
 *
 * @param ms
 * @returns
 */
export function msToTimeStamp(ms: number): TimeStamp {
  let milliseconds = ms % 1000;
  ms -= milliseconds;
  let seconds = (ms % (60 * 1000)) / 1000;
  ms -= seconds * 1000;
  let minutes = (ms % (60 * 60 * 1000)) / 60000;
  ms -= minutes * 60 * 1000;
  let hours = (ms % (60 * 60 * 60 * 1000)) / (60 * 60 * 1000);
  return {
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}

export function addTime(timeStamp: TimeStamp, ms: number) {
  const { hours, minutes, seconds, milliseconds } = timeStamp;
  const newMs = milliseconds + ms;
  return {
    hours,
    minutes,
    seconds: seconds + Math.floor(newMs / 1000),
    milliseconds: newMs % 1000,
  };
}

export function subtractTime(timeStamp: TimeStamp, ms: number) {
  let { hours, minutes, seconds, milliseconds } = timeStamp;
  const newMs = milliseconds - ms;
  if (newMs < 0) {
    seconds--;
    if (seconds < 0) {
    }
  }
  return {
    hours,
    minutes,
    seconds: seconds + Math.floor(newMs / 1000),
    milliseconds: newMs % 1000,
  };
}
