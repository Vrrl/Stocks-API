import { Engine } from './engine';
import container from './infra/injector';
import TYPES from './infra/types';

process.on('uncaughtException', err => {
  console.error('Exceção não capturada:', err);
  process.exit(1);
});

const engine = container.get<Engine>(TYPES.Engine);

engine.startProcessing();
