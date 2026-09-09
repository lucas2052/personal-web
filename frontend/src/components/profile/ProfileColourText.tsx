import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'

function decorate(node: ReactNode, index: { value: number }): ReactNode {
  return Children.map(node, child => {
    if (typeof child === 'string' || typeof child === 'number') {
      return Array.from(String(child)).map(character => {
        if (/\s/.test(character)) return character
        const characterIndex = index.value++
        // Jump between separated hues so neighbouring letters read as
        // individual flat colours rather than a continuous spectrum.
        const colourOrder = [0, 2, 1, 3, 2, 0, 3, 1]
        const colour = colourOrder[characterIndex % colourOrder.length]
        return (
          <span
            className="profile-colour-char"
            data-colour={colour}
            key={`${characterIndex}-${character}`}
          >
            {character}
          </span>
        )
      })
    }

    if (isValidElement(child)) {
      const element = child as ReactElement<{ children?: ReactNode }>
      if (!element.props.children) return element
      return cloneElement(element, undefined, decorate(element.props.children, index))
    }

    return child
  })
}

export default function ProfileColourText({ children }: { children: ReactNode }) {
  return <>{decorate(children, { value: 0 })}</>
}
