interface ThemeTextProps {
  text: string
  className?: string
}

const ThemeText = (props: ThemeTextProps) => {
  return <span className={`text-violet-500`}>{props.text}</span>
}

export default ThemeText
