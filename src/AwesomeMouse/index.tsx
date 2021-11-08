// @flow
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import './awesomeMouse.scss';

type Props = {
	children: React.ReactChild | React.ReactChild[];
	color: string;
};

const AwesomeMouse = ({ children, color }: Props) => {
	const mouseRef = useRef<any>();
	const cursorRef = useRef<any>();
	const pointerRef = useRef<any>();

	const [pointer, setPointer] = useState<any>({ x: 0, y: 0 });
	const [outer, setOuter] = useState<any>({ x: 0, y: 0 });
	const [styleCursor, setStyleCursor] = useState<any>();
	const [stylePointer, setStylePointer] = useState<any>();
	const [stopFlag, setStopFlag] = useState<boolean>(true);
	const [isActive, setIsActive] = useState<boolean>(false);

	const mousemove = (e: any) => {
		setStopFlag(false);
		setPointer({ x: e.clientX, y: e.clientY });
		setTimeout(() => {
			const outerX = e.clientX - 30 / 2;
			const outerY = e.clientY - 30 / 2;

			setOuter({ x: outerX, y: outerY });
		}, 50);
	};

	useEffect(() => {
		const moveCursorDom = () => {
			if (!isActive) {
				setStyleCursor({
					transform: `matrix(1, 0, 0, 1, ${outer.x}, ${outer.y})`,
					border: `1px solid ${color}`,
					opacity: 1,
				});

				setStylePointer({
					transform: `matrix(1, 0, 0, 1, ${pointer.x}, ${pointer.y}) translate3d(-50%, -50%, 0)`,
					backgroundColor: `${color}`,
					opacity: 1,
				});

				mouseRef.current = requestAnimationFrame(moveCursorDom);
			} else {
				setStyleCursor({
					transform: `matrix(1, 0, 0, 1, ${outer.x}, ${outer.y}) scale(3)`,
					backgroundColor: `${color}`,
					opacity: 0.2,
				});

				mouseRef.current = requestAnimationFrame(moveCursorDom);
			}
		};
		mouseRef.current = requestAnimationFrame(moveCursorDom);
		return () => cancelAnimationFrame(mouseRef.current);
	}, [pointer, outer, isActive, color]);

	useEffect(() => {
		const element = document.querySelectorAll('a');

		element.forEach((el) => {
			el.addEventListener('mouseover', () => {
				setIsActive(true);
			});
			el.addEventListener('click', () => {
				setIsActive(true);
			});
			el.addEventListener('mouseup', () => {
				setIsActive(true);
			});
			el.addEventListener('mouseout', () => {
				setIsActive(false);
			});
		});

		return () => {
			element.forEach((el) => {
				el.removeEventListener('mouseover', () => {
					setIsActive(true);
				});
				el.removeEventListener('click', () => {
					setIsActive(true);
				});
				el.removeEventListener('mouseup', () => {
					setIsActive(true);
				});
				el.removeEventListener('mouseout', () => {
					setIsActive(false);
				});
			});
		};
	}, [isActive]);

	return (
		<div className='magicCursor' onMouseMove={mousemove}>
			<div
				ref={cursorRef}
				className={classNames('mouse', { cursor: !stopFlag })}
				style={styleCursor}></div>
			<div
				ref={pointerRef}
				className={classNames('mouse', { magicPointer: !stopFlag })}
				style={stylePointer}></div>
			{children}
		</div>
	);
};

export default AwesomeMouse;
