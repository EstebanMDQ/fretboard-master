import { getAudioContext } from './engine'

export interface ScheduledEvent {
  time: number
  callback: (time: number) => void
}

export interface SchedulerHandle {
  schedule: (events: ScheduledEvent[]) => void
  cancelAll: () => void
}

const LOOKAHEAD_INTERVAL_MS = 25
const SCHEDULE_HORIZON_SECONDS = 0.1

/**
 * Generic lookahead scheduler: wakes on a short interval and fires any queued events that fall
 * within a short horizon, keyed off audioContext.currentTime rather than setInterval/setTimeout
 * firing time. Each caller gets its own handle, so independent clients (metronome, note-sequence
 * playback) can run concurrently without one client's stop() cancelling another's queued events.
 */
export function createSchedulerHandle(): SchedulerHandle {
  let queue: ScheduledEvent[] = []
  let timerId: ReturnType<typeof setInterval> | null = null

  function tick() {
    const context = getAudioContext()
    const horizon = context.currentTime + SCHEDULE_HORIZON_SECONDS
    const due: ScheduledEvent[] = []
    const pending: ScheduledEvent[] = []
    for (const event of queue) {
      if (event.time <= horizon) due.push(event)
      else pending.push(event)
    }
    queue = pending
    due.forEach((event) => event.callback(event.time))
  }

  function schedule(events: ScheduledEvent[]) {
    queue.push(...events)
    if (timerId === null) {
      timerId = setInterval(tick, LOOKAHEAD_INTERVAL_MS)
    }
  }

  function cancelAll() {
    queue = []
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
  }

  return { schedule, cancelAll }
}
