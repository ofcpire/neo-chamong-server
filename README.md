# 네오-차몽

## 개요

차몽(https://github.com/codestates-seb/seb42_main_003) 프로젝트의 서버 리버싱 프로젝트입니다.

## 목표

원본 프로젝트의 서버의 모든 기능을 구현 및 보완합니다.

## 배포

[클라이언트](https://chamong.netlify.app/)는 Netlify를 사용해 배포중입니다.

서버는 AWS EC2와 Api gateway를 사용해 배포중입니다.

## 스택

- Nestjs
- Typescript
- MongoDB
- Mongoose

## 프로젝트 구조

```
src
├─articles
│  └─dto
├─auth
├─camp
│  ├─bookmark
│  └─review
│      └─dto
├─common
│  ├─helper
│  └─interceptor
├─image
├─main
├─members
│  └─dto
├─mypage
└─place
    └─pick-places
        └─dto
```
- auth 모듈
    - Jwt 토큰과 passport, auth strategy를 사용해 액세스, 리프레시 토큰을 발급하고 로그인 기능을 지원합니다.
    - optional-auth interceptor를 사용하여 요청 시 토큰 여부를 확인해 같은 api 요청에 다른 응답이 가능합니다.
- camp 모듈
    - 3000여개 캠핑장에 대한 조회 및 기타 기능을 지원합니다.
    - 북마크 모듈
        - 유저별로 캠핑장에 대한 북마크를 추가 및 삭제할 수 있습니다.
    - 리뷰 모듈
        - 캠핑장에 리뷰 코멘트를 추가하고 삭제할 수 있습니다.
- articles 모듈
    - 커뮤니티 페이지의 글, 댓글의 작성 및 삭제를 지원합니다.
    - 글 작성 시 이미지를 올릴 수 있습니다. (3mb 제한)
    - 각 글에 추천을 하고 취소할 수 있습니다.
- image 모듈
    - 업로드된 이미지를 서버에 저장한 후, 다시 조회하기 위한 서비스를 제공합니다.
- members 모듈
    - 로그인 시 사용되는 api에 사용되는 모듈로 auth 모듈을 사용하여 새 계정 생성, 로그인, 토큰 검증 기능을 지원합니다.
- mypage 모듈
    - 마이페이지에서 사용되는 모듈로 유저 별 프로필과 유저가 남긴 캠핑장 리뷰, 글, 댓글 목록 등을 모아볼 수 있는 기능을 제공합니다.
- place 모듈
    - pick-places 모듈
        - 마이페이지에서 나만의 캠핑장을 추가, 삭제, 공유 할 수 있는 모듈입니다.
