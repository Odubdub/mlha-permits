import React, { useContext } from 'react'
import Countdown from "react-countdown";
import { clearToken } from './Auth/AuthService';
import { AuthContext } from './AuthContext';

const SessionTimer = () => {

  const { userData, setUserData } = useContext(AuthContext)

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a complete state
        if (userData != null) {
            clearToken()
            setUserData(null)
        }
        console.log('Logout this nice person!')
        return <span>Logout</span>
    } else {
        // Render a countdown
        return (
        <span>
            {`${hours}`.padStart(2, '0')}:{`${minutes}`.padStart(2, '0')}:{`${seconds}`.padStart(2, '0')}
        </span>
        )
    }
  }

  return (
    <Countdown date={new Date(userData.exp*1000)} renderer={renderer} />
  )
}

export default SessionTimer