/* tracing-simon.js */
'use strict'

const dotenv = require('dotenv')
dotenv.config()

const opentelemetry = require("@opentelemetry/sdk-node")
const { LogLevel } = require("@opentelemetry/core")
const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')

const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base')
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node")
// const { MeterProvider, PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics-base')

// const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc')
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
// const { OTLPTraceSpanExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node")
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express")
// const { KafkaJsInstrumentation } = require('opentelemetry-instrumentation-kafkajs')
// const { RouterInstrumentation } = require('@opentelemetry/instrumentation-router');
// const { SocketIoInstrumentation } = require('opentelemetry-instrumentation-socket.io');
const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const { HttpInstrumentation } = require ('@opentelemetry/instrumentation-http')
const { GraphQLInstrumentation } = require ('@opentelemetry/instrumentation-graphql')

const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api')
// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG)

const collectorOptions = {
  url: 'http://192.168.0.9:4317/v1/traces', // url is optional and can be omitted - default is http://localhost:4318/v1/traces
  headers: {}, // an optional object containing custom headers to be sent with each request
  concurrencyLimit: 10, // an optional limit on pending requests
}

const exporter = new OTLPTraceExporter(collectorOptions)

// const sdk = new opentelemetry.NodeSDK({
//   traceExporter: new opentelemetry.tracing.ConsoleSpanExporter(),
//   instrumentations: 
//     [
//       getNodeAutoInstrumentations(),
//       new ExpressInstrumentation({
//         requestHook: (span, requestInfo) => {
//           span.setAttribute(
//             "http.request.body",
//             JSON.stringify(requestInfo.req.body)
//           );
//         },
//       }),
//       // new RouterInstrumentation(),
//       // new SocketIoInstrumentation(),
//       new KafkaJsInstrumentation(),
//       new GraphQLInstrumentation() 
//     ]
// });

// Register server-related instrumentation
registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new GraphQLInstrumentation()
  ]
})

const provider = new NodeTracerProvider({
  resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV
    }),
})

const consoleExporter = new ConsoleSpanExporter()

// Configure span processor to send spans to the exporter
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
provider.register()

// sdk.start()
//   .then(() => console.log('Tracing initialized'))
//     .catch((error) => console.log('Error initializing tracing', error));
  
//   // gracefully shut down the SDK on process exit
//   process.on('SIGTERM', () => {
//     sdk.shutdown()
//     .then(() => console.log('Tracing terminated'))
//     .catch((error) => console.log('Error terminating tracing', error))
//     .finally(() => process.exit(0));
//     });


// ---








// const sdk = new opentelemetry.NodeSDK({
//   traceExporter: new opentelemetry.tracing.ConsoleSpanExporter(),
//   instrumentations: 
//     [
//       getNodeAutoInstrumentations(),
//       new ExpressInstrumentation({
//         requestHook: (span, requestInfo) => {
//           span.setAttribute(
//             "http.request.body",
//             JSON.stringify(requestInfo.req.body)
//           );
//         },
//       }),
//       // new RouterInstrumentation(),
//       // new SocketIoInstrumentation(),
//       new KafkaJsInstrumentation() 
//     ]
// });

// const provider = new NodeTracerProvider({
//   resource: new Resource({
//       [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
//       [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.DEPLOYMENT_ENVIRONMENT
//     }),
// });

// const exporter = new OTLPTraceExporter();

// // --- Metrics Working Target Common
// // const metricExporter = new OTLPMetricExporter({});

// // const meterProvider = new MeterProvider({
// //   resource: new Resource({
// //       [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
// //       [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.DEPLOYMENT_ENVIRONMENT
// //   }),
// // });

// // Configure span processor to send spans to the exporter
// provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
// provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
// provider.register();

// sdk.start()
//   .then(() => console.log('Tracing initialized'))
//     .catch((error) => console.log('Error initializing tracing', error));
  
//   // gracefully shut down the SDK on process exit
//   process.on('SIGTERM', () => {
//     sdk.shutdown()
//     .then(() => console.log('Tracing terminated'))
//     .catch((error) => console.log('Error terminating tracing', error))
//     .finally(() => process.exit(0));
//     });

// ---