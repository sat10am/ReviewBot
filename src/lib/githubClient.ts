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
    author: {
      login: string;
    }
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
              author {
                login  
              }
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
      name: process.env.REPOSITORY_NAME,
      owner: process.env.REPOSITORY_OWNER,
    }
  );

  const ignoreKeywords = (process.env.IGNORE_KEYWORDS || '').split(',');

  return response.repository.pullRequests.edges
    .filter((pr:IPullRequest) => ignoreKeywords.some((keyword: string) => pr.node.title.includes(keyword)))
    .filter(
    (pr: IPullRequest) => pr.node.reviewRequests.totalCount > 0
  );
};

export {
  fetchPendingPullRequests,
  IReviewRequest,
  IPullRequest,
  IPendingPullRequestResponse,
};
