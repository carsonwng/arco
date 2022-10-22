import { useEffect } from "react";

import { ArcoHeader } from "./components/header/header"

import styles from './app.module.scss'
import { Router } from "./router";
import { useDiscordStore } from "./store/discordStore";

const App = () => {
  const user = useDiscordStore()
  
  useEffect(() => {
    if (!user.loggedIn) return
    if (new Date(user.user.expires_at) <= new Date()) return user.clear()
  }, [])

  return (<>
    <ArcoHeader />

    <Router />
    </>
  );
}

export default App;