import { useEffect, useRef, useState } from 'react';
import styles from './RangeSlider.module.scss';

interface Props {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  onChangeLive?: (value: number) => void;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export default function RangeSlider(props: Props) {
  const {
    value,
    max,
    onChange,
    onChangeLive,
    direction = 'horizontal',
    className,
  } = props;

  const containerRef = useRef<HTMLButtonElement>(null);
  const [sliderActive, setSliderActive] = useState(false);
  const [keyboardActive, setKeyboardActive] = useState(false);

  useEffect(() => {
    if (sliderActive) {
      const getValueByCoords = (x: number, y: number) => {
        if (!containerRef.current) return 0;

        if (direction === 'horizontal') {
          const { left } = containerRef.current.getBoundingClientRect();

          return Math.max(
            Math.min(
              Math.round((max * (x - left)) / containerRef.current.clientWidth),
              max
            ),
            0
          );
        } else {
          const { top } = containerRef.current.getBoundingClientRect();

          return Math.max(
            Math.min(
              (max * (containerRef.current.clientHeight - (y - top))) /
                containerRef.current.clientHeight,
              max
            ),
            0
          );
        }
      };

      const onMouseMove = (e: MouseEvent) => {
        onChangeLive!(getValueByCoords(e.pageX, e.pageY));
      };

      const onMouseUp = (e: MouseEvent) => {
        if (onChange) {
          onChange(getValueByCoords(e.pageX, e.pageY));
        }
        setSliderActive(false);
        setKeyboardActive(false);
      };

      if (onChangeLive) {
        document.addEventListener('mousemove', onMouseMove);
      }

      document.addEventListener('mouseup', onMouseUp);

      return () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderActive, direction]);

  useEffect(() => {
    if (keyboardActive && (onChange || onChangeLive)) {
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Escape':
            setKeyboardActive(false);
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            if (onChange) {
              onChange(Math.max(value - 5, 0));
            } else {
              onChangeLive!(Math.max(value - 5, 0));
            }
            break;
          case 'ArrowRight':
          case 'ArrowUp':
            if (onChange) {
              onChange(Math.min(value + 5, max));
            } else {
              onChangeLive!(Math.min(value + 5, max));
            }
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardActive, value]);

  return (
    <button
      ref={containerRef}
      className={`${styles.container} ${
        direction === 'vertical' ? styles['container--vertical'] : ''
      } ${keyboardActive ? styles.active : ''} ${className}`}
      onMouseDown={() => setSliderActive(true)}
      onFocus={() => setKeyboardActive(true)}
      onBlur={() => setKeyboardActive(false)}
    >
      <div className={styles.slider}>
        <div
          className={styles.progress}
          style={{
            [direction === 'horizontal' ? 'width' : 'height']:
              (Math.round(value) === Math.round(max)
                ? 100
                : (Math.floor(value) / max) * 100) + '%',
          }}
        >
          <div className={styles.thumb} />
        </div>
      </div>
    </button>
  );
}
