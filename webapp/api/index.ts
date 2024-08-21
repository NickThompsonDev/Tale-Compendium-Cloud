import * as users from './users';
import * as npcs from './npcs';
import * as files from './files';
import * as openai from './openai';
import * as  stripe from './stripe';

const api = {
  users,
  npcs,
  files,
  openai,
  stripe
};

export default api;
