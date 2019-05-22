import {
  fetchPendingPullRequests,
  IPullRequest,
  IReviewRequest,
} from './lib/githubClient';
import { IncomingWebhook } from '@slack/webhook';
import { config } from 'dotenv';
import { RecurrenceRule, scheduleJob, Range } from "node-schedule";

config();

const webhook = new IncomingWebhook(process.env.WEBHOOK_URL);

const notifyReviewRequest = async () => {
  const pullRequests: IPullRequest[] = await fetchPendingPullRequests();
  const requests = pullRequests.map(v => {
    const reviewers = v.node.reviewRequests.edges
      .map((request: IReviewRequest) => request.node.requestedReviewer.name)
      .join(', ');
    return webhook.send({
      attachments: [
        {
          color: '#439FE0',
          fields: [
            {
              short: false,
              title: 'URL',
              value: v.node.url,
            },
            {
              short: true,
              title: 'Author',
              value: v.node.author.login,
            },
            {
              short: true,
              title: 'Reviewer',
              value: reviewers,
            },
          ],
          title: v.node.title,
          title_link: v.node.url,
        },
      ],
      text: `${reviewers} 님 처리되지 않은 PR이 있어요!`,
    });
  });

  await Promise.all(requests);
};

process.env.NOTIFY_TIME.split(',').forEach((h) => {
  const rule = new RecurrenceRule();
  rule.hour = Number(h);
  rule.minute = 0;
  rule.dayOfWeek = new Range(0,6);
  scheduleJob(rule, async () => {
    await notifyReviewRequest();
  });
});


