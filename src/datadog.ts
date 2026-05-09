import { datadogRum } from '@datadog/browser-rum';

const applicationId = import.meta.env.VITE_DATADOG_APPLICATION_ID;
const clientToken = import.meta.env.VITE_DATADOG_CLIENT_TOKEN;
const site = import.meta.env.VITE_DATADOG_SITE || 'datadoghq.com';
const service = import.meta.env.VITE_DATADOG_SERVICE || 'otterai';
const env = import.meta.env.VITE_DATADOG_ENV || import.meta.env.MODE;
const version = import.meta.env.VITE_DATADOG_VERSION;

function readSampleRate(name: string, fallback: number) {
  const value = Number(import.meta.env[name]);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(100, Math.max(0, value));
}

export function initDatadog() {
  if (!applicationId || !clientToken) {
    if (import.meta.env.DEV) {
      console.info('Datadog RUM skipped: missing application ID or client token.');
    }
    return;
  }

  datadogRum.init({
    applicationId,
    clientToken,
    site,
    service,
    env,
    version,
    sessionSampleRate: readSampleRate('VITE_DATADOG_SESSION_SAMPLE_RATE', 100),
    sessionReplaySampleRate: readSampleRate(
      'VITE_DATADOG_SESSION_REPLAY_SAMPLE_RATE',
      0,
    ),
    trackResources: true,
    trackLongTasks: true,
    trackUserInteractions: true,
    defaultPrivacyLevel: 'mask-user-input',
  });

  if (import.meta.env.VITE_DATADOG_START_SESSION_REPLAY === 'true') {
    datadogRum.startSessionReplayRecording();
  }

  datadogRum.startView({
    name: 'Otter AI',
  });

  if (import.meta.env.DEV) {
    console.info('Datadog RUM initialized.');
  }
}
