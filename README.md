# 🚀 ReviewBot

Pull Request의 Reviewer로 지정되었는데 처리가 안되어있을시 지정된 시간에 알림을 해주는 봇 입니다.

> Pull Reminder 가 유료여서 개발...

## 🚨 ENV Configuration
아래 알맞는 환경변수를 등록해야 정상적으로 동작합니다. 

```text
GITHUB_TOKEN=<GITHUB_TOKEN>
WEBHOOK_URL=<SLACK_WEBHOOK_URL>
REPOSITORY_OWNER=<REPO_OWNER>
REPOSITORY_NAME=<REPO_NAME> 
NOTIFY_TIME=<NOTIFY_HOUR> ex) 8,22 input hour (0-24) csv 
IGNORE_KEYWORDS=<PR_TITLE_IGNORE_KEYWORDS> ex) WIP,Do Not Merge
```

## 🛠 Built With 

* TypeScript
* Github v4 Graphql API 
* node-schedule
* Slack webhook
