import { useTextScramble } from '@/hooks/useTextScramble'

export function ScrambleText({
  as = 'span',
  text,
  className,
  enabled = true,
  trigger = 'view',
  once = true,
  duration = 640,
  fps = 60,
  startDelay = 0,
  charset,
  viewThreshold,
  viewRoot,
  viewRootMargin
}) {
  const Component = as
  const { ref, text: output, onMouseEnter } = useTextScramble(text, {
    enabled,
    trigger,
    once,
    duration,
    fps,
    startDelay,
    charset,
    viewThreshold,
    viewRoot,
    viewRootMargin
  })

  return (
    <Component ref={ref} className={className} onMouseEnter={onMouseEnter}>
      {output}
    </Component>
  )
}
