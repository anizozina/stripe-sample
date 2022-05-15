## 概要

- stripeで色々動かしてみる

ref. https://stripe.com/docs/payments/save-and-reuse

とりあえずクレカの登録ができるまで。
## 動かし方
### セットアップ

`.env` を作成し、以下の情報を埋める

```.env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY
```

いずれもStripeのダッシュボードで入手できる、 pk_test あるいは sk_testから始まる値。

### 起動

```
npm run dev
```