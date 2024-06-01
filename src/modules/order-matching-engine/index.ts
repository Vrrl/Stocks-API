import TYPES from '@src/core/types';
import { Engine } from './engine';
import container from './infra/injector';

process.on('uncaughtException', err => {
  console.error('Exceção não capturada:', err);
  process.exit(1);
});

const engine = container.get<Engine>(TYPES.Engine);

engine.startProcessing();
