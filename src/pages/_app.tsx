import { type AppType } from "next/app";
import {useAuth} from '../context/hooks/useAuth'
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { AuthContext } from "~/context/AuthContext";

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
          <Component {...pageProps} />
  )
};

export default api.withTRPC(MyApp);
