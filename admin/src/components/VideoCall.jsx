import React, { useEffect } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import axios from 'axios';
import { DoctorContext } from '../context/DoctorContext';

function VideoCall({ roomUrl, roomToken, appointmentId }) {
  const navigate = useNavigate();
  const { backendUrl, dToken } = useContext(DoctorContext)
  


  async function leftCall() {
    await axios.post(backendUrl + '/api/doctor/doctor-left-call', { appointmentId }, { headers: { dToken } })
      .then((response) => {
        console.log(response.data);
        navigate('/doctor-dashboard'); // Adjust the redirect path as necessary
      })
      .catch((error) => {
        console.error('Error leaving call:', error);
      });
  }

  useEffect(() => {
    const frame = DailyIframe.createFrame({
      showLeaveButton: true,
      iframeStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: '0',
        zIndex: 9999,
      },
    });

    // 1. Append to document.body instead of relying on component DOM
    if (frame.iframe instanceof Node) {
      document.body.appendChild(frame.iframe);
    }

    // 2. Load (not join) to show prebuilt UI
    frame.join({ url: `${roomUrl}?t=${roomToken}` });

    // 3. Redirect on leave
    frame.on('left-meeting', () => {
      frame.destroy();
      leftCall(); // Call the function to handle leaving the call
    });

    return () => {
      frame.leave();
      frame.destroy();
      if (frame.iframe && frame.iframe.remove) {
        frame.iframe.remove();
      }
    };
  }, [roomUrl, roomToken, navigate]);

  return null; // We don't need to render anything in the DOM
}

export default VideoCall;
