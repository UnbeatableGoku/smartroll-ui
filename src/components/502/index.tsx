import React from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { PAGE_DASHBOARD } from '@constants'
import { Button } from '@components/common/form'

const Error502: React.FC = () => {
  const navigate = useNavigate()

  const backToHome = () => {
    navigate(PAGE_DASHBOARD.path)
  }

  return (
    <>
      <Helmet>
        <title>Smart Roll | Under Maintenance</title>
      </Helmet>

      <div style={styles.body}>
        <div style={styles.container}>
          <div style={styles.logo}>
            <img
              src="https://smartroll.live/assets/smartroll-Cw8fyRYE.png"
              alt="Smartroll Logo"
              style={styles.logoImage}
            />
          </div>
          <p style={styles.paragraph}>
            We are currently performing maintenance on our systems.<br />
            We'll be back shortly!
          </p>
          <Button
            label="Back to home"
            variant="outline"
            size="small"
            className="w-32"
            type="button"
            onClick={backToHome}
          />
        </div>
      </div>
    </>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: '#ffffff',
    color: '#333333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    textAlign: 'center',
  },
  container: {
    maxWidth: '500px',
    padding: '20px',
  },
  logo: {
    marginBottom: '30px',
    display:'flex',
    justifyContent:'center'
  },
  logoImage: {
    width: '150px',
    height: 'auto',
  },
  paragraph: {
    fontSize: '12px',
    lineHeight: 1.5,
    color: '#666666',
    marginBottom: '30px',
  },
  contact: {
    fontSize: '12px',
    color: '#666666',
    marginTop: '40px',
  },
  link: {
    color: '#1e88e5',
    textDecoration: 'none',
  },
}

export default Error502
