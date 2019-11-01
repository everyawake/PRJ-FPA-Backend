# PRJ-FPA-Backend

FPA(FreePath Authenticator)

[![Build Status](https://travis-ci.com/everyawake/PRJ-FPA-Backend.svg?branch=master)](https://travis-ci.com/everyawake/PRJ-FPA-Backend)

## Tech Stack
Node.js base
- Express.js
- JsonWebToken
- MySql2
- socket.io with socket.io-client
- Typescript
- SendGrid for email transfer


: EveryAwake!! with Slack

## APIs

### User

- [x] Member Sign up
- [x] Email Confirm issue
- [x] Email Confirm check
- [x] Sign In
- [ ] Reset password(이메일 관련 작업 필요)
- [x] Change finger print
- [ ] Update user info(Device id, developer mode, admin mode, etc)
- [x] Generate new OTID
- [x] Find user id(OTID 로 회원정보를 찾음)
- [x] disconnect to Third-part app/web

### FPA

- [x] 유저에게 지문 인증 요청
- [x] 서버와 Third-party에게 지문 인증 결과 전송

### Board

- [ ] Notification board

### Third-party

- [x] Add new app/web
- [x] Regenerate public key
- [ ] Update Third-party info
- [x] Get user token
- [x] Connect this user(* User assent page, 페북으로 로그인 사용시 정보 제공 동의 같은 기능)

## Accessory

- [x] CI/CD: TravisCI
- [x] Email service: https://sendgrid.com/

# Setup

1. need to sendgrid API key: [Check ref](https://app.sendgrid.com/guide/integrate/langs/nodejs)
2. need AWS .env
