import React from 'react'
import { CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
  const styles = {
    body: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '20px'
    },
    button: {
      marginTop: '60px',
      backgroundColor: 'rgb(37, 99, 235)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '12px',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px',
      cursor: 'pointer',
      fontSize: '1.125rem',
      borderWidth: '0px'
    }
  }

  const checks = [
    'Admission requirements',
    'Application deadlines',
    'Program details',
    'Tuition and fees',
    'How to apply'
  ]

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1>Welcome to Conestoga Admissions Chatbot</h1>
        <p>
          Get instant answers about admissions, programs, deadlines, tuition,
          and more!
        </p>
        <div style={styles.grid}>
          {checks.map((item, index) => (
            <CheckList key={index} item={item} />
          ))}
        </div>
        <Link to="/chat">
          <button style={styles.button}>Start chatting</button>
        </Link>
      </div>
    </div>
  )
}

const CheckList = (props: { item: string; key: number }) => {
  const { item } = props
  const styles = {
    container: {
      boxShadow:
        '0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      padding: '1rem',
      backgroundColor: 'white',
      borderColor: 'rgb(209 213 219 / 1)',
      borderWidth: '1px',
      borderRadius: '0.5rem',
      borderStyle: 'solid',
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      gap: '10px'
    }
  }
  return (
    <div style={styles.container}>
      <CheckCircle color="green" />
      <span className="text-lg font-medium text-gray-700">{item}</span>
    </div>
  )
}

export default Home
