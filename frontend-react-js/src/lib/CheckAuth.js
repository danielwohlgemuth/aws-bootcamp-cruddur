import { fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';


export async function getAccessToken() {
  try {
    const { accessToken } = (await fetchAuthSession()).tokens ?? {};
    return accessToken;
  } catch (error) {
    console.log('error getting access token: ', error);
  }
}

export async function checkAuth(setUser) {
  try {
    const user = await fetchUserAttributes();
    setUser({
      cognito_user_uuid: cognito_user.attributes.sub,
      display_name: user.name,
      handle: user.preferred_username,
    });
  } catch (error) {
    console.log('error checking user authentication: ', error);
  }
}