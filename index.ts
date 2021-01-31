import * as NekoServer from './server/express';
import { config } from 'dotenv'

config()
const server = NekoServer.getServerInstance();
NekoServer.initialize(server);