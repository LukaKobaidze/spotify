'use client';
import { useContext } from 'react';
import { LayoutContext } from '@/context/layout.context';

type Props = {
  sizeMin: number;
  sizeMax: number;
  windowWidthMin: number;
  windowWidthMax: number;
} & (
  | ({
      element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    } & React.HTMLAttributes<HTMLHeadingElement>)
  | ({ element: 'span' } & React.HTMLAttributes<HTMLSpanElement>)
  | ({ element: 'p' } & React.HTMLAttributes<HTMLParagraphElement>)
);

export default function FluidTypography(props: Props) {
  const {
    element,
    sizeMin,
    sizeMax,
    windowWidthMin,
    windowWidthMax,
    style,
    children,
    ...restProps
  } = props;

  const ElementRender: keyof JSX.IntrinsicElements = props.element;
  const { mainViewSize } = useContext(LayoutContext);

  const elementStyle = {
    fontSize: `calc(${sizeMin}px + (${sizeMax} - ${sizeMin}) * ((${mainViewSize}px - 300px) / (${windowWidthMax} - ${windowWidthMin})))`,
    ...style,
  } as React.CSSProperties;

  return (
    <ElementRender style={elementStyle} {...restProps}>
      {children}
    </ElementRender>
  );
}
