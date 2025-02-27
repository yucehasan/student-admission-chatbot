import React from 'react'

const NavItem = (props: { href: string; text: string }): React.ReactElement => {
  const { href, text } = props

  const styles = {
    link: {
      textDecoration: 'none',
      color: 'lightgray',
      fontWeight: 'bold',
      backgroundColor: 'transparent',
      padding: '10px 15px'
    },
    linkHover: {
      backgroundColor: 'gray'
    }
  }

  return (
    <li>
      <a
        href={href}
        style={styles.link}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = styles.linkHover.backgroundColor)
        }
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = styles.link.backgroundColor)
        }
      >
        {text}
      </a>
    </li>
  )
}

const Header = (): React.ReactElement => {
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: 'black',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },

    logo: {
      height: '50px'
    },

    ul: {
      listStyle: 'none',
      display: 'flex',
      gap: '10px'
    }
  }

  return (
    <header style={styles.header}>
      <div className="logo">
        <img
          src="/conestoga-logo.svg"
          alt="Conestoga College Logo"
          style={styles.logo}
        />
      </div>
      <nav className="nav">
        <ul style={styles.ul}>
          <NavItem href="/" text="Home" />
          <NavItem href="programs" text="Programs" />
          <NavItem href="admissions" text="Campuses" />
        </ul>
      </nav>
    </header>
  )
}

export default Header
