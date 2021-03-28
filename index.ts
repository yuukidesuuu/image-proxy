import { fork, isMaster, on, setupMaster } from "cluster";
import { cpus } from "os";

if (isMaster) {
  setupMaster({
    exec: './src/master',
    execArgv: ['--use', 'http'],
    silent: true,
  });

  for (let i = 0; i < cpus().length; i++) {
    fork();
  }
  on('disconnect', (w) => fork());
  on('exit', (w) => fork());
}