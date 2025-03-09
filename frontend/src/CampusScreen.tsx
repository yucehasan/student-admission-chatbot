import React, { CSSProperties } from 'react'

type Campus = {
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

const CampusScreen = () => {
  const data = [{ id: 1, name: 'Waterloo Campus' }]
  if (!data) {
    return <div>Loading...</div>
  }
  return (
    <div style={styles.container}>
      <h1>Campuses</h1>
      <ul>
        {data.map((campus: Campus) => (
          <li key={campus.id}>{campus.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default CampusScreen
