import { createAuth0, type GetTokenSilentlyOptions } from '@auth0/auth0-vue'

export const auth0 = createAuth0({
  domain: 'dev-qlvesfqc.eu.auth0.com',
  clientId: 'YDUPK67Yrdr1d5YEySsGClDxNsn1tXNm',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'https://dev-qlvesfqc.eu.auth0.com/api/v2/',
    scope: 'openid profile email offline_access'
  },
  useRefreshTokens: true,
  cacheLocation: 'localstorage'
})

export const getAccessToken = async () => {
  const accessToken = await auth0.getAccessTokenSilently({})
  return accessToken
}