import Link from 'next/link'

interface LogoProps {
  className?: string
}

const Logo = (props: LogoProps) => {
  return (
    <Link href="/">
      <h1 className={`text-xl font-bold ${props.className} text-violet-500`}>
        PoolHub
      </h1>
    </Link>
  )
}

export default Logo
