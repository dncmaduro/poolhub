import Link from 'next/link'

interface LogoProps {
  className?: string
}

const Logo = (props: LogoProps) => {
  console.log(process.env.NEXT_PUBLIC_SUPABASE_KEY)

  return (
    <Link href="/">
      <h1 className={`text-xl font-bold ${props.className} text-violet-500`}>
        PoolHub
      </h1>
    </Link>
  )
}

export default Logo
