import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import 'web-vitals';

const sdk = new HoneycombWebSDK({
  apiKey: '***REMOVED***',
  serviceName: 'frontend-react-js',
  instrumentations: [getWebAutoInstrumentations()],
  webVitalsInstrumentationConfig: {
    vitalsToTrack: [],
  },
});
sdk.start();
