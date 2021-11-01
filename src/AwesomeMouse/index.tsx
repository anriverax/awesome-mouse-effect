// @flow
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import './awesomeMouse.scss';

type Props = {
	children: React.ReactChild | React.ReactChild[];
};

const AwesomeMouse = ({ children }: Props) => {
	const cursorRef = useRef<any>();

	const [pointer, setPointer] = useState({ x: 0, y: 0 });
	const [outer, setOuter] = useState({ x: 0, y: 0 });
	const [styleCursor, setStyleCursor] = useState<any>();
	const [stylePointer, setStylePointer] = useState<any>();
	const [stopFlag, setStopFlag] = useState<boolean>(true);

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
			if (!stopFlag) {
				setStyleCursor({
					transform: `matrix(1, 0, 0, 1, ${outer.x}, ${outer.y})`,
					width: '30px',
					height: '30px',
				});

				setStylePointer({
					transform: `matrix(1, 0, 0, 1, ${pointer.x}, ${pointer.y}) translate3d(-50%, -50%, 0)`,
				});

				cursorRef.current = requestAnimationFrame(moveCursorDom);
			}
		};
		cursorRef.current = requestAnimationFrame(moveCursorDom);
		return () => cancelAnimationFrame(cursorRef.current);
	}, [pointer, outer, stopFlag]);

	return (
		<div className='mouse' onMouseMove={mousemove}>
			<div className={classNames({ cursor: !stopFlag })} style={styleCursor}></div>
			<div className={classNames({ pointer: !stopFlag })} style={stylePointer}></div>
			{children}
		</div>
	);
};

export default AwesomeMouse;
