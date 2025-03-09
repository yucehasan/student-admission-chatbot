import React, { CSSProperties } from 'react'

type Program = {
  id: number
  name: string
}

const styles: CSSProperties = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: '20px'
  }
}

const ProgramScreen = () => {
  const data = [{ id: 1, name: 'Computer Programmer' }]
  if (!data) {
    return <div>Loading...</div>
  }
  return (
    <div style={styles.container}>
      <h1>Programs</h1>
      <ul>
        {data.map((program: Program) => (
          <li key={program.id}>{program.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default ProgramScreen
