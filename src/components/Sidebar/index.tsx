import Link from "next/link";
import styles from './Sidebar.module.scss'

interface Props {
  
}

export default function Sidebar(props: Props) {

  return <aside className={styles.sidebar}>

    <nav className={`roundedContainer ${styles.nav}`}>
      <Link href="/" className="textButton">Home</Link>
      <Link href="/search" className="textButton">Search</Link>
    </nav>
  </aside>
}