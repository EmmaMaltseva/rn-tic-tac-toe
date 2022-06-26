import Koa from 'koa';
import Router from '@koa/router'
import { v4 as uuidv4 } from 'uuid'
import { Cell, State } from '../mobile-app/game/Engine'

const app =  new Koa();
const router = new Router();

const players: Record<string, string> = {};
/*
{
  'player1': 'player2',
  'player2': 'player1',
}
 */

const playersQueue: string[] = []; 

router.post('/register', ctx => {
  const newPlayerId = uuidv4();

  playersQueue.push(newPlayerId);

  ctx.body = newPlayerId
});

interface PendingServerState {
  status: 'pending';
  isItMyTurn: false;
}
interface StartedServerState {
  status: 'started';
  state: State;
  whoAmI: Cell.X | Cell.O;
  isItMyTurn: boolean;
}
interface FinishedServerState {
  status: 'finished';
  state: State;
  whoAmI: Cell.X | Cell.O;
  isItMyTurn: false;
}

type ServerState = PendingServerState | StartedServerState | FinishedServerState;

router.get('/state', ctx => {
  const state: ServerState = {
    status: 'pending',
    isItMyTurn: false,
  }
  ctx.body = state;
})

app.use(router.routes())

app.listen(3000);



