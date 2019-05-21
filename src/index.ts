import { fetchPendingPullRequests, IPullRequest } from './lib/githubClient';
import { config } from 'dotenv';

config();

(async () => {
  // const {
  // 	repository: {
  // 		pullRequests: {
  // 			edges
  // 		}
  // 	}
  // } = await fetchPendingPullRequests();

  // console.log(edges);
  const pullRequests: IPullRequest[] = await fetchPendingPullRequests();

  console.log(JSON.stringify(pullRequests));
})();
