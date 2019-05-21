import { GraphQLClient } from 'graphql-request';

const GITHUB_ENDPOINT = 'https://api.github.com/graphql';

interface IReviewRequest {
  node: {
    requestedReviewer: {
      __typename: string;
      name: string;
    };
  };
}

interface IPullRequest {
  node: {
    title: string;
    url: string;
    reviewRequests: {
      totalCount: number;
      edges: IReviewRequest[];
    };
  };
}

interface IPendingPullRequestResponse {
  repository: {
    pullRequests: {
      totalCount: number;
      edges: IPullRequest[];
    };
  };
}

const fetchPendingPullRequests = async () => {
  const graphQLClient = new GraphQLClient(GITHUB_ENDPOINT, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  const query = `
		query findPendingPullRequest($owner: String! $name: String!) {
			repository(owner: $owner name: $name) {
				pullRequests(first:100 states: OPEN) {
					totalCount
					edges {
						node {
							title
							url
							reviewRequests(first:100) {
								totalCount
								edges{
									node {
									requestedReviewer {
											__typename
											... on User {
												name
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
  `;

  const response = await graphQLClient.request<IPendingPullRequestResponse>(
    query,
    {
      owner: process.env.REPOSITORY_OWNER,
      name: process.env.REPOSITORY_NAME,
    }
  );

  return response.repository.pullRequests.edges.filter(
    (pr: IPullRequest) => pr.node.reviewRequests.totalCount > 0
  )
};

export { fetchPendingPullRequests, IReviewRequest, IPullRequest, IPendingPullRequestResponse };
