import Link from 'next/link'

interface LogoProps {
  className?: string
}

const Logo = (props: LogoProps) => {
  return (
    <Link href="/">
      <h1
        className={`text-xl font-bold ${props.className} transform-opacity rounded-lg px-2 pt-1 text-violet-500 transition hover:bg-violet-500 hover:text-white`}
      >
        PoolHub
      </h1>
    </Link>
  )
}

export default Logo
