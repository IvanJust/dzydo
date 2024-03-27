module.exports = {
  apps: [{
    name: "app",
    script: "./index.js",
    watch: true,
    env: {
      NODE_ENV: "development",
      SERVER_PORT:3000,
      SOCKET_PORT:3001,
      PGPORT:5432,

      PGHOST:'79.174.84.7',
      PGUSER:'clientweb',
      PGPASSWORD:'qwertyAndroid',
      PGDATABASE:'dzydo',

      JWT_SECRET_KEY:'>/..F?mj*{Q"SNi{,B<NQ6r9)9AFCjaU*u6z?&F5>.#oF*9ew6"Kkps]>NZ(;6,WrJo+O<"tBciUuS%SD7E0sXUxW!*!cP2W/Lo5LT>dINU*V_?+q,{&c3Ym5:{pA,ygCiZD$]O;web#CV&m#ri*#G[52bhp>>',
      TOKEN_HEADER_KEY:'D7E0sXUxW!*!cP2W/Lo5LT>dINU*V_?+q,{&c3Ym5:{pA,ygCiZD$]O;web#CV&m#ri*#G[52bhp>>'
    }
  }]
}