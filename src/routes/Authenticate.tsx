import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStytchUser, useStytch } from "@stytch/react";

const OAUTH_TOKEN = "oauth";

const Authenticate = () => {
  const { user } = useStytchUser();
  const stytch = useStytch();
  const navigate = useNavigate();
  const location = useLocation();

  const queryString = new URLSearchParams(location.search);

  useEffect(() => {
    async function handleOAuthRedirect() {
      if (stytch && !user) {
        const stytch_token_type = queryString.get("stytch_token_type");
        const token = queryString.get("token");
        if (token && stytch_token_type === OAUTH_TOKEN) {
          await stytch.oauth.authenticate(token, {
            session_duration_minutes: 60,
          });
          navigate("/");
        }
      }
    }
    handleOAuthRedirect();
  }, [stytch, user, queryString, navigate]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  return null;
};

export default Authenticate;