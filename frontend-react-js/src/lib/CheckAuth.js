import { fetchUserAttributes } from 'aws-amplify/auth';

const checkAuth = async (setUser) => {
    try {
        const user = await fetchUserAttributes();
        setUser({
          display_name: user.name,
          handle: user.preferred_username,
        });
      } catch (error) {
        console.log('error checking user authentication: ', error);
      }
};

export default checkAuth;