#!/usr/bin/env node
import { FreshDeskServer } from './server.js';

const server = new FreshDeskServer();
server.run().catch(console.error);
